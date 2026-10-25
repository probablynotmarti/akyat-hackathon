// Own one camera request and stream. Stopping also invalidates pending permission requests.
export function createCameraSession({ getUserMedia, getVideo, requestFrame, cancelFrame, decode, onState, onRead, onError }) {
  let generation = 0, stream = null, frame = null;
  const release = media => media?.getTracks().forEach(track => track.stop());
  function stop(report = true) {
    generation += 1;
    cancelFrame(frame); frame = null;
    release(stream); stream = null;
    const video = getVideo();
    if (video) video.srcObject = null;
    if (report) onState('idle');
  }
  async function start() {
    stop(false);
    const current = generation;
    onState('opening');
    try {
      const media = await getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      if (current !== generation) { release(media); return; }
      stream = media;
      const video = getVideo();
      if (!video) throw new Error('The camera preview is unavailable. Please try again.');
      // React may not have committed the live state yet. Reveal before asking Safari to play.
      video.hidden = false; video.muted = true; video.playsInline = true; video.srcObject = media;
      onState('live');
      await video.play();
      if (current !== generation) return;
      const poll = () => {
        if (current !== generation) return;
        try {
          const value = video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0 ? decode(video) : null;
          if (value) { stop(); onRead(value); return; }
          frame = requestFrame(poll);
        } catch (error) { stop(); onError(error); }
      };
      frame = requestFrame(poll);
    } catch (error) {
      if (current !== generation) return;
      stop(); onError(error);
    }
  }
  return { start, stop };
}

export function cameraErrorMessage(error) {
  if (error.name === 'NotAllowedError') return 'Camera access or playback was blocked. Allow camera access for this site in Safari, then try again. You can also upload your saved QR or use the booking reference.';
  if (['NotReadableError', 'AbortError'].includes(error.name)) return 'The camera could not stay open. Close other camera apps or tabs, then try again. Upload QR and reference lookup still work.';
  if (error.name === 'NotFoundError') return 'No available camera was found. Upload your saved QR or use the booking reference.';
  return error.message || 'The camera could not start. Upload your saved QR or use the booking reference.';
}

import React, { useEffect, useRef, useState } from 'react';
import { Camera, QrCode, Upload, X } from 'lucide-react';
import jsQR from 'jsqr';
import { createCameraSession, cameraErrorMessage } from './camera-session';

function decodeImage(source, width, height, maxWidth) {
  const canvas = document.createElement('canvas');
  const scale = Math.min(1, maxWidth / width);
  canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale);
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  return jsQR(pixels.data, pixels.width, pixels.height)?.data;
}

export function Scanner({ onRead }) {
  const video = useRef(null), file = useRef(null), session = useRef(null), callbacks = useRef(null);
  const [state, setState] = useState('idle'), [message, setMessage] = useState(''), [error, setError] = useState(false);
  const fail = problem => { setError(true); setMessage(cameraErrorMessage(problem)); };
  const read = value => { setError(false); setMessage('QR read. Camera stopped. Review the check-in result below.'); onRead(value); };
  callbacks.current = { read, fail };
  useEffect(() => {
    session.current = createCameraSession({
      getUserMedia: options => {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera access is unavailable here. Open the HTTPS demo in Safari, or upload your saved QR.');
        return navigator.mediaDevices.getUserMedia(options);
      },
      getVideo: () => video.current,
      requestFrame: callback => requestAnimationFrame(callback), cancelFrame: id => cancelAnimationFrame(id),
      decode: element => decodeImage(element, element.videoWidth, element.videoHeight, 800),
      onState: setState, onRead: value => callbacks.current.read(value), onError: problem => callbacks.current.fail(problem),
    });
    return () => session.current.stop(false);
  }, []);
  const start = () => { setError(false); setMessage('Allow camera access if Safari asks. Point at a personal Jump-off Pass.'); session.current.start(); };
  const upload = event => {
    const selected = event.target.files?.[0]; event.target.value = ''; if (!selected) return;
    session.current.stop();
    if (!selected.type.startsWith('image/')) { fail(new Error('Choose a PNG, JPEG or WebP QR image.')); return; }
    const url = URL.createObjectURL(selected), image = new Image();
    image.onload = () => {
      try {
        const value = decodeImage(image, image.width, image.height, 1800);
        if (value) read(value); else fail(new Error('No readable QR found. Try the original saved QR image or paste its reference.'));
      } catch { fail(new Error('Could not read this image. Try a PNG or JPEG of the saved pass.')); }
      finally { URL.revokeObjectURL(url); }
    };
    image.onerror = () => { URL.revokeObjectURL(url); fail(new Error('Could not read this image. Try a PNG or JPEG.')); };
    image.src = url;
  };
  const active = state !== 'idle';
  return <>
    <div className={`scanner-window ${state === 'live' ? 'live' : ''}`}>
      <video ref={video} autoPlay playsInline muted hidden={state !== 'live'} aria-label="QR camera preview"/>
      {state !== 'live' && <><span className="scan-corners"><QrCode size={70} strokeWidth={1.2}/></span><h3>{state === 'opening' ? 'Opening your camera…' : 'One scan. Everything in place.'}</h3><p>{state === 'opening' ? 'Check Safari’s camera permission prompt.' : 'Scan a personal Jump-off Pass to check its status.'}</p></>}
      <span className="scanner-corner tl"/><span className="scanner-corner tr"/><span className="scanner-corner bl"/><span className="scanner-corner br"/>
    </div>
    <div className="button-row"><button className="button primary grow" onClick={active ? () => {session.current.stop();setMessage('Camera stopped. You can upload a QR or use a booking reference.');} : start}>{active ? <X size={17}/> : <Camera size={17}/>} {state === 'opening' ? 'Cancel camera' : active ? 'Stop camera' : 'Open camera'}</button><button className="button secondary grow" onClick={() => file.current.click()}><Upload size={17}/> Upload QR</button><input ref={file} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={upload}/></div>
    {message && <p className={`scanner-feedback ${error ? 'error' : ''}`} role={error ? 'alert' : 'status'}>{message}</p>}
    <p className="small muted">For this demo, create the booking and validate it in the same browser. You can show its saved QR on another screen, upload it here, or use the reference below.</p>
  </>;
}

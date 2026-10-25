import test from 'node:test';
import assert from 'node:assert/strict';
import QRCode from 'qrcode';
import jsQR from 'jsqr';

function roundTrip(payload) {
  const qr = QRCode.create(payload, { errorCorrectionLevel: 'M' });
  const scale = 8, margin = 4, size = (qr.modules.size + margin * 2) * scale;
  const data = new Uint8ClampedArray(size * size * 4).fill(255);
  for (let y = 0; y < qr.modules.size; y++) for (let x = 0; x < qr.modules.size; x++) {
    if (!qr.modules.get(y, x)) continue;
    for (let sy = 0; sy < scale; sy++) for (let sx = 0; sx < scale; sx++) {
      const i = (((y + margin) * scale + sy) * size + (x + margin) * scale + sx) * 4;
      data[i] = 23; data[i + 1] = 62; data[i + 2] = 50;
    }
  }
  return jsQR(data, size, size)?.data;
}

test('personal QR round-trips through the actual generator and scanner libraries', () => {
  const payload = 'AKYAT:38582d0e-d563-414e-9c73-d42e9fa0256f';
  assert.equal(roundTrip(payload), payload);
});
test('public invitation QR remains a URL, distinct from personal admission', () => {
  const payload = 'https://example.com/?party=amihan-ridge#trip/amihan-ridge';
  assert.equal(roundTrip(payload), payload);
  assert.equal(roundTrip(payload).startsWith('AKYAT:'), false);
});

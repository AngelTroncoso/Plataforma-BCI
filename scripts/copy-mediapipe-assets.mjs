import { cp, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const source = new URL('../node_modules/@mediapipe/tasks-vision/wasm/', import.meta.url);
const target = new URL('../public/mediapipe/wasm/', import.meta.url);
if (existsSync(source)) {
  await mkdir(target, { recursive: true });
  await cp(source, target, { recursive: true });
  console.log('MediaPipe Wasm copied to public/mediapipe/wasm');
}

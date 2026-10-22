import { mkdir, writeFile } from 'node:fs/promises';

const modelUrl = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task';
const output = new URL('../public/mediapipe/face_landmarker.task', import.meta.url);
await mkdir(new URL('../public/mediapipe/', import.meta.url), { recursive: true });
const response = await fetch(modelUrl);
if (!response.ok) throw new Error(`Model download failed: ${response.status}`);
await writeFile(output, new Uint8Array(await response.arrayBuffer()));
console.log('Face Landmarker model saved in public/mediapipe');

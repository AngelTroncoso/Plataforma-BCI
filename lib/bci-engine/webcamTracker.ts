import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { EAR_BLINK_THRESHOLD, GestureClassifier } from './gestureClassifier';
import type { TrackingMetrics } from './types';

export type TrackingCallback = (metrics: TrackingMetrics, points: Array<{ x: number; y: number }>) => void;
const dist = (a: {x:number;y:number}, b: {x:number;y:number}) => Math.hypot(a.x-b.x, a.y-b.y);
const eyeRatio = (p: Array<{x:number;y:number}>, ids: number[]) => {
  const [a,b,c,d,e,f] = ids.map(i => p[i]);
  return a && f ? (dist(b,f) + dist(c,e)) / (2 * dist(a,d)) : .3;
};

export class WebcamTracker {
  private stream?: MediaStream; private landmarker?: FaceLandmarker; private running = false;
  private frame = 0; private lastFpsAt = 0; private fps = 0; private classifier = new GestureClassifier();
  async start(video: HTMLVideoElement, onFrame: TrackingCallback) {
    this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 30 } }, audio: false });
    video.srcObject = this.stream; await video.play();
    // Keep the intent layer on-device and force the WebGL backend without contacting a server.
    const tf = await import('@tensorflow/tfjs-core');
    await import('@tensorflow/tfjs-backend-webgl');
    await tf.setBackend('webgl');
    await tf.ready();
    const vision = await FilesetResolver.forVisionTasks('/mediapipe/wasm');
    this.landmarker = await FaceLandmarker.createFromOptions(vision, { baseOptions: { modelAssetPath: '/mediapipe/face_landmarker.task', delegate: 'GPU' }, runningMode: 'VIDEO', numFaces: 1, outputFaceBlendshapes: true });
    this.running = true; this.lastFpsAt = performance.now();
    let animationFrame = 0;
    let videoFrame = 0;
    const scheduleNextFrame = () => {
      if (!this.running) return;
      if (typeof video.requestVideoFrameCallback === 'function') videoFrame = video.requestVideoFrameCallback(loop);
      else animationFrame = requestAnimationFrame(loop);
    };
    const loop = () => { if (!this.running) return; const now = performance.now(); const started = now; const result = this.landmarker?.detectForVideo(video, now); const p = result?.faceLandmarks?.[0] ?? [];
      const left = p[468], right = p[473];
      const gazeX = left && right ? Math.max(0, Math.min(1, ((left.x + right.x) / 2 - .25) / .5)) : .5;
      const gazeY = left && right ? Math.max(0, Math.min(1, ((left.y + right.y) / 2 - .2) / .55)) : .5;
      const ear = p.length ? (eyeRatio(p, [33,160,158,133,153,144]) + eyeRatio(p, [362,385,387,263,373,380])) / 2 : .3;
      this.frame++; if (now - this.lastFpsAt > 1000) { this.fps = this.frame; this.frame = 0; this.lastFpsAt = now; }
      const command = this.classifier.update(ear, gazeX, now); const attention = Math.round(Math.max(0, Math.min(100, 45 + (1 - Math.abs(gazeX - .5) * 2) * 35 + (ear > .2 ? 12 : -10))));
      onFrame({ gazeX, gazeY, ear, blinking: ear < EAR_BLINK_THRESHOLD, fps: this.fps, inferenceMs: Math.round(performance.now() - started), attention, webgl: true, command }, p.map(v => ({x:v.x,y:v.y})));
      scheduleNextFrame();
    };
    scheduleNextFrame();
  }
  stop() { this.running = false; this.landmarker?.close(); this.landmarker = undefined; this.stream?.getTracks().forEach(t => t.stop()); }
}

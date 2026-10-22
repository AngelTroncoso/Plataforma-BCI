# MediaPipe assets

Run `npm run assets:mediapipe` after `npm install` to copy the Wasm runtime and download the
`face_landmarker.task` model. The app references them at `/mediapipe/face_landmarker.task` and
`/mediapipe/wasm`, which Vercel serves as static CDN assets.

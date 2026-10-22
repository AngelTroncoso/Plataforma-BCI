# NeuroGaze BCI Lab

Plataforma web de control ocular y gestual en tiempo real, ejecutada íntegramente
en el navegador. La cámara, MediaPipe, TensorFlow.js y el EEG sintético no envían
vídeo ni telemetría a un servidor.

## Ejecutar localmente

```bash
npm install
npm run assets:mediapipe
npm run dev
```

Abra `http://localhost:3000`, acepte el permiso de cámara y use una webcam frontal.
La aplicación utiliza la malla facial de MediaPipe para estimar mirada y EAR:

- Desviar la mirada: navegación.
- Parpadeo sostenido (más de 500 ms): foco.
- Doble parpadeo: selección.

## Producción y Vercel

```bash
npm run build
```

Los archivos Wasm y el modelo de Face Landmarker se sirven desde
`/public/mediapipe`, por lo que Vercel los publica mediante CDN. El componente
de laboratorio se carga en una frontera de cliente con SSR desactivado: no se
evalúan `navigator.mediaDevices`, WebGL ni Web Workers durante el renderizado
en servidor.

## Estructura

- `lib/bci-engine/webcamTracker.ts`: cámara, Face Landmarker, iris, mirada y EAR.
- `lib/bci-engine/gestureClassifier.ts`: traducción de gestos a comandos.
- `lib/bci-engine/syntheticEEGWorker.ts`: ondas EEG sintéticas en un Web Worker.
- `components/`: vídeo/malla, EEG, HUD de métricas y matriz de control.

'use client';

import dynamic from 'next/dynamic';

// Browser-only boundary: webcam, MediaPipe, WebGL and Web Workers are never
// evaluated during server rendering or Vercel's build-time prerendering.
const NeuroLab = dynamic(() => import('./NeuroLab'), {
  ssr: false,
  loading: () => <main className="min-h-screen grid place-items-center bg-ink text-cyan">INICIALIZANDO LABORATORIO NEURAL…</main>
});

export default function NeuroLabClient() {
  return <NeuroLab />;
}

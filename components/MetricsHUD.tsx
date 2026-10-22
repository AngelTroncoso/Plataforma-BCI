'use client';
import type { TrackingMetrics } from '@/lib/bci-engine/types';
export function MetricsHUD({ metrics }: { metrics: TrackingMetrics }) {
  const data = [['FPS', metrics.fps || '—'], ['INFERENCIA', `${metrics.inferenceMs} ms`], ['MIRADA', `${Math.round(metrics.gazeX*100)}, ${Math.round(metrics.gazeY*100)}`], ['EAR', metrics.ear.toFixed(3)], ['WEBGL', metrics.webgl ? 'ACTIVO' : 'ESPERA'], ['ATENCIÓN', `${metrics.attention}%`]];
  return <section className="panel rounded-xl p-4"><div className="mb-3 text-xs font-bold tracking-[.22em] text-cyan">TELEMETRÍA EN VIVO</div><div className="grid grid-cols-2 gap-2">{data.map(([k,v]) => <div key={k} className="rounded bg-slate-950/60 p-2"><div className="text-[9px] tracking-widest text-slate-500">{k}</div><div className="mt-1 font-mono text-sm text-cyan">{v}</div></div>)}</div></section>;
}

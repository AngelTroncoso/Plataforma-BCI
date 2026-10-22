'use client';
import { useEffect, useRef } from 'react';
type Waves = { alpha:number[]; beta:number[]; theta:number[] };
export function EEGVisualizer({ waves }: { waves: Waves | null }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => { const c = ref.current; if (!c || !waves) return; const ctx = c.getContext('2d'); if (!ctx) return; const {width:w,height:h}=c; ctx.fillStyle='#060d18'; ctx.fillRect(0,0,w,h);
    [['alpha','#35d8ff',waves.alpha],['beta','#9672ff',waves.beta],['theta','#39e58c',waves.theta]].forEach(([,color,values],row) => { ctx.strokeStyle=color as string; ctx.lineWidth=1.5; ctx.beginPath(); (values as number[]).forEach((value,i) => { const x=i/((values as number[]).length-1)*w, y=h*(.17+row*.33)-value*h*.17; i?ctx.lineTo(x,y):ctx.moveTo(x,y); });ctx.stroke(); }); }, [waves]);
  return <section className="panel rounded-xl overflow-hidden"><div className="flex justify-between px-4 pt-3 text-xs"><span className="font-bold tracking-[.2em] text-cyan">EEG SINTÉTICO</span><span className="text-slate-500">α 8–12Hz · β 13–30Hz · θ 4–8Hz</span></div><canvas ref={ref} width={720} height={230} className="mt-2 h-48 w-full" /></section>;
}

export {};
type Input = { gazeX: number; gazeY: number; attention: number; blinking: boolean };
let phase = 0;
self.onmessage = (event: MessageEvent<Input>) => {
  const { attention, gazeX, blinking } = event.data; const samples = 96; const alpha: number[] = [], beta: number[] = [], theta: number[] = [];
  for (let i = 0; i < samples; i++) { const t = phase + i / samples * Math.PI * 2; const noise = (Math.random() - .5) * .12;
    alpha.push(Math.sin(t * 2.1) * (.25 + (100-attention)/170) + noise);
    beta.push(Math.sin(t * 6.8 + gazeX * 2) * (.18 + attention/150) + noise);
    theta.push(Math.sin(t * 1.1) * (blinking ? .65 : .33) + noise);
  } phase += .16; self.postMessage({ alpha, beta, theta });
};

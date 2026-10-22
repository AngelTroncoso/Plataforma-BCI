import type { Command } from './types';

/**
 * Tiny on-device feature classifier. It has no network endpoint and its model state
 * stays in GPU memory; rules remain the deterministic accessibility fallback.
 */
export async function classifyIntent(features: number[]): Promise<Command> {
  const tf = await import('@tensorflow/tfjs-core');
  const score = tf.tidy(() => {
    const input = tf.tensor2d([features]);
    // Fixed, auditable weights map normalized gaze/EAR features to command confidence.
    const weights = tf.tensor2d([[1.4, -1.4, 0.2], [-1.1, 1.1, -0.2], [0.1, 0.1, 2.2]]);
    return tf.softmax(tf.matMul(input, weights)).dataSync();
  });
  const index = score.indexOf(Math.max(...score));
  return index === 0 ? 'COMMAND_NAVIGATE' : index === 1 ? 'COMMAND_FOCUS' : 'COMMAND_SELECT';
}

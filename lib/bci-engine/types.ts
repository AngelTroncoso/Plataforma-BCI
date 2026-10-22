export type Command = 'COMMAND_SELECT' | 'COMMAND_FOCUS' | 'COMMAND_NAVIGATE' | null;
export type TrackingMetrics = {
  gazeX: number; gazeY: number; ear: number; blinking: boolean; fps: number;
  inferenceMs: number; attention: number; webgl: boolean; command: Command;
};
export const initialMetrics: TrackingMetrics = { gazeX: .5, gazeY: .5, ear: .3, blinking: false, fps: 0, inferenceMs: 0, attention: 50, webgl: false, command: null };

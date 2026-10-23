import type { Command } from './types';
import { classifyIntent } from './localIntentModel';

export const EAR_BLINK_THRESHOLD = 0.28;
export const DOUBLE_BLINK_WINDOW_MS = 800;

/** Converts low-level eye observations into deliberate, debounced commands. */
export class GestureClassifier {
  private blinkStarted = 0;
  private lastBlinkEnd = 0;
  private blinkCount = 0;
  private focusSent = false;
  private lastMlAt = 0;
  private lastMlCommand: Command = null;
  update(ear: number, gazeX: number, now = performance.now()): Command {
    const closed = ear < EAR_BLINK_THRESHOLD;
    if (closed && !this.blinkStarted) { this.blinkStarted = now; this.focusSent = false; }
      if (closed && this.blinkStarted && now - this.blinkStarted > 500 && !this.focusSent) { this.focusSent = true; return 'COMMAND_FOCUS'; }
    if (!closed && this.blinkStarted) {
      this.blinkCount = this.blinkCount === 1 && now - this.lastBlinkEnd <= DOUBLE_BLINK_WINDOW_MS ? 2 : 1;
      this.lastBlinkEnd = now; this.blinkStarted = 0;
      if (this.blinkCount === 2) {
        this.blinkCount = 0;
        this.lastBlinkEnd = 0;
        return 'COMMAND_SELECT';
      }
    }
    if (Math.abs(gazeX - .5) > .32) {
      // Run a bounded local tensor pass as an additional signal; the deterministic
      // result keeps visual navigation responsive while it resolves.
      if (now - this.lastMlAt > 400) {
        this.lastMlAt = now;
        void classifyIntent([gazeX, 1 - gazeX, Math.min(1, ear * 3)]).then(command => { this.lastMlCommand = command; });
      }
      return this.lastMlCommand ?? 'COMMAND_NAVIGATE';
    }
    return null;
  }
}

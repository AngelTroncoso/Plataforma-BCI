import type { Command } from './types';
import { classifyIntent } from './localIntentModel';

/** Converts low-level eye observations into deliberate, debounced commands. */
export class GestureClassifier {
  private blinkStarted = 0;
  private lastBlinkEnd = 0;
  private focusSent = false;
  private lastMlAt = 0;
  private lastMlCommand: Command = null;
  update(ear: number, gazeX: number, now = performance.now()): Command {
    const closed = ear < .19;
    if (closed && !this.blinkStarted) { this.blinkStarted = now; this.focusSent = false; }
    if (closed && now - this.blinkStarted > 500 && !this.focusSent) { this.focusSent = true; return 'COMMAND_FOCUS'; }
    if (!closed && this.blinkStarted) {
      const doubleBlink = now - this.lastBlinkEnd < 450;
      this.lastBlinkEnd = now; this.blinkStarted = 0;
      if (doubleBlink) return 'COMMAND_SELECT';
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

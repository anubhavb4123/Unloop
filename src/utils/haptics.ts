/**
 * Haptic feedback utility using the Vibration API.
 * Falls back silently on unsupported devices (desktop, iOS Safari).
 */

const canVibrate = typeof navigator !== 'undefined' && 'vibrate' in navigator

function vibrate(pattern: number | number[]) {
  if (canVibrate) {
    try {
      navigator.vibrate(pattern)
    } catch {
      // Silently fail on unsupported contexts
    }
  }
}

export const haptics = {
  /** Light tap — button press, card select (10ms) */
  light: () => vibrate(10),

  /** Medium tap — step transition, confirm (25ms) */
  medium: () => vibrate(25),

  /** Strong tap — important action, end loop (40ms) */
  strong: () => vibrate(40),

  /** Soft double-tap — feedback message appears (10-pause-10) */
  double: () => vibrate([10, 50, 10]),

  /** Breathing inhale — gentle rising pulse (15-30-20) */
  breatheIn: () => vibrate([15, 30, 20]),

  /** Breathing hold — single subtle tick (8ms) */
  breatheHold: () => vibrate(8),

  /** Breathing exhale — soft descending pulse (20-30-15) */
  breatheOut: () => vibrate([20, 30, 15]),

  /** Exercise switch — crisp transition (5-40-5) */
  switchExercise: () => vibrate([5, 40, 5]),

  /** Stretch instruction change — gentle nudge (12ms) */
  stretchStep: () => vibrate(12),

  /** Session complete — satisfying pattern (20-80-20-80-40) */
  complete: () => vibrate([20, 80, 20, 80, 40]),

  /** Warning — loop re-entry detected (30-60-30) */
  warning: () => vibrate([30, 60, 30]),

  /** Success — action saved, session recorded (15-40-25) */
  success: () => vibrate([15, 40, 25]),
}

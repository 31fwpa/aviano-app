import { Capacitor } from "@capacitor/core";

export function triggerHaptic(pattern: number | number[] = 10) {
  // Native: use Capacitor Haptics for proper iOS/Android feedback.
  if (Capacitor.isNativePlatform()) {
    void import("@capacitor/haptics")
      .then(({ Haptics, ImpactStyle }) => Haptics.impact({ style: ImpactStyle.Light }))
      .catch(() => {
        // Ignore if plugin unavailable.
      });
    return;
  }
  // Web fallback.
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore unsupported or blocked vibration calls.
    }
  }
}

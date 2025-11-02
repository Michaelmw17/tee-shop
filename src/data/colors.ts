export const COLOR_SWATCH_MAP: Record<string, string> = {
  white: "#ffffff",
  black: "#222222",
  bone: "#e3dac9",
  cream: "#f5f5dc",
  charcoal: "#36454f",
  olive: "#556b2f",
  brown: "#8b4513"
};

export const ORDERED_COLOR_KEYS = Object.freeze([
  "white",
  "black",
  "bone",
  "cream",
  "charcoal",
  "olive",
  "brown"
] as const);

export type SupportedColor = (typeof ORDERED_COLOR_KEYS)[number];

export function getCanonicalColorName(raw: string): SupportedColor | null {
  if (!raw) {
    return null;
  }

  const normalized = raw.toLowerCase();
  if (ORDERED_COLOR_KEYS.includes(normalized as SupportedColor)) {
    return normalized as SupportedColor;
  }

  const sanitized = normalized.replace(/[^a-z0-9]/g, "");
  const matchBySanitized = ORDERED_COLOR_KEYS.find(
    (key) => sanitized === key.replace(/[^a-z0-9]/g, "")
  );
  if (matchBySanitized) {
    return matchBySanitized;
  }

  const matchByInclusion = ORDERED_COLOR_KEYS.find((key) => normalized.includes(key));
  return matchByInclusion ?? null;
}

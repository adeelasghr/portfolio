export function parseNum(val: unknown): number {
  if (typeof val === "number") return val;
  const s = String(val ?? "").trim();
  if (!s) return 0;

  // If both '.' and ',' exist, treat '.' as thousands and ',' as decimals (de-DE).
  if (s.includes(",") && s.includes(".")) {
    return parseFloat(s.replace(/\./g, "").replace(",", "."));
  }
  // Only comma: decimal comma.
  if (s.includes(",")) {
    return parseFloat(s.replace(",", "."));
  }
  // Plain number string.
  return parseFloat(s);
}
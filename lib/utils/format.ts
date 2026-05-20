export function formatNumber(value: number) {
  return new Intl.NumberFormat("en", { notation: value >= 10000 ? "compact" : "standard" }).format(value);
}

export function formatPercent(value: number) {
  return `${Math.round(value * 10) / 10}%`;
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "Not yet";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

export function titleCase(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

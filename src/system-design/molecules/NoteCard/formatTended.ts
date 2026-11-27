/** Format an ISO date string as e.g. "Nov 15" (UTC, so it matches the stored date regardless of viewer timezone). */
export function formatTended(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

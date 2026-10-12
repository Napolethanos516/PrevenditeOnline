export function formatEventDateLabel(eventDate: string | null): string {
  if (!eventDate) return "Data da confermare";
  const parsed = new Date(eventDate);
  if (Number.isNaN(parsed.getTime())) return "Data da confermare";
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

export function getAvailabilityLabel(soldOut: boolean): string {
  return soldOut ? "Esaurito" : "Disponibile";
}

// Utility to format date for input fields
export const formatDateForInput = (dateStr: string | Date): string => {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
};


export function formatBookingDates(raw: string): string {
  const date = new Date(raw);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// Utility function to format dates
export function formatDate(dateString: Date): string | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  };
  return date.toLocaleDateString("en-GB", options); // e.g., "01 Jan 2025"
}

export function formatDateWithDayAndMonth(dateString: Date): string | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
  };
  return date.toLocaleDateString("en-GB", options); // e.g., "01 Jan"
}

export function formatDateWithTime(dateString: Date): string | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return `${date.toLocaleDateString(
    "en-GB",
    dateOptions
  )} ${date.toLocaleTimeString("en-GB", timeOptions)}`; // e.g., "01 Jan 2025 6:07 PM"
}

export function formatTime(dateString: Date): string | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleTimeString("en-GB", timeOptions); // e.g., "6:07 PM"
}

export function formatDateFormInput(date: Date) {
  const investedDate = new Date(date);
  const formattedDate =
    investedDate.getFullYear() +
    "-" +
    String(investedDate.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(investedDate.getDate()).padStart(2, "0");

  return formattedDate;
}

export const formatDate = (date: string | Date) => {
  const data = typeof date === "string" ? new Date(date) : date;
  return new Date(date).toLocaleString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

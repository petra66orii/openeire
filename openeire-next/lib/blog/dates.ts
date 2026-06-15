const IRISH_VISIBLE_DATE_FORMATTER = new Intl.DateTimeFormat("en-IE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export const formatBlogDisplayDate = (
  value?: string | null,
  fallback = "",
): string => {
  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return IRISH_VISIBLE_DATE_FORMATTER.format(date);
};

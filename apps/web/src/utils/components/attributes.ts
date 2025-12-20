
export const classNames = (names?: string | (string | undefined)[]): string => {
  if (!names) return "";
  if (Array.isArray(names)) {
    return names
      .map((c) => Array.isArray(c) ? classNames(c) : c ? c.trim() : null)
      .filter(Boolean)
      .join(" ");
  }
  return classNames(names.split(" "));
};

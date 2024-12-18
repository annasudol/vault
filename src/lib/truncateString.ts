export function truncateString(
  str?: string,
  maxLength?: number,
): string | undefined {
  if (!str) {
    return undefined;
  }
  if (str.length <= (maxLength || 500)) {
    return str;
  }
  return `${str.slice(0, (maxLength || 500) - 3)}...`;
}

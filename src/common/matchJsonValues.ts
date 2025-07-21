/**
 * Recursively searches all values in a JSON object for a case-insensitive substring match.
 * Keys are ignored completely — only values are checked.
 */
export function matchJsonValues(data: unknown, query: string): boolean {
  const q = query.toLowerCase();

  const search = (value: unknown): boolean => {
    if (value == null) return false;

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return String(value).toLowerCase().includes(q);
    }

    if (Array.isArray(value)) {
      return value.some(search);
    }

    if (typeof value === "object") {
      for (const val of Object.values(value)) {
        if (search(val)) return true;
      }
    }

    return false;
  };

  return search(data);
}

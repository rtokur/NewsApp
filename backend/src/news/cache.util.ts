export function buildCacheKey(prefix: string, params: Record<string, any>) {
  if (!params) {
    return prefix;
  }

  const normalizedParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return `${prefix}?${normalizedParams}`;
}

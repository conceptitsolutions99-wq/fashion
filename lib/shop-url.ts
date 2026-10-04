export type ShopParams = Record<string, string | undefined>;

/**
 * Builds a /shop href from the current query params plus any overrides.
 * Setting a value to undefined/"" removes it, so filters behave like toggles.
 */
export function buildShopHref(current: ShopParams, overrides: ShopParams = {}): string {
  const merged: ShopParams = { ...current, ...overrides };
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(merged)) {
    if (!value) continue;
    // selecting the same gender/category again clears it (toggle behaviour)
    if (key in overrides && overrides[key] === current[key]) continue;
    params.set(key, value);
  }

  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

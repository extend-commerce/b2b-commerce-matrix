import type { Feature, Provider } from '../types';
import csvRaw from './b2b-feature-matrix.csv?raw';

// ── CSV parser ────────────────────────────────────────────────────────────────
// Parses b2b-feature-matrix.csv into a Feature array.
// Columns: id, feature, category, provider, app
// To update features: edit src/data/b2b-feature-matrix.csv and push to git.
function parseFeatureCSV(csv: string): Feature[] {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  const idx = {
    id:       headers.indexOf('id'),
    feature:  headers.indexOf('feature'),
    category: headers.indexOf('category'),
    provider: headers.indexOf('provider'),
    app:      headers.indexOf('app'),
  };

  return lines.slice(1)
    .filter(line => line.trim().length > 0)
    .map(line => {
      // Simple CSV split — handles the data as-is (no quoted commas in this CSV)
      const cols = line.split(',').map(c => c.trim());

      // Some feature names might contain commas — join excess columns back into
      // the feature field to be safe (feature is the second column, idx 1):
      const totalCols = headers.length;
      const overflow = cols.length - totalCols;
      if (overflow > 0) {
        const featureParts = cols.splice(idx.feature, overflow + 1);
        cols.splice(idx.feature, 0, featureParts.join(','));
      }

      const provider = cols[idx.provider] as Provider;
      const app = idx.app >= 0 ? cols[idx.app] || undefined : undefined;

      return {
        id:       cols[idx.id],
        feature:  cols[idx.feature],
        category: cols[idx.category],
        provider,
        ...(app ? { app } : {}),
      } satisfies Feature;
    });
}

// ── Exports ───────────────────────────────────────────────────────────────────

export const FEATURES: Feature[] = parseFeatureCSV(csvRaw);

// Category order is derived from the CSV (first-seen order), not hardcoded
export const CATEGORIES: string[] = FEATURES.reduce<string[]>((acc, f) => {
  if (!acc.includes(f.category)) acc.push(f.category);
  return acc;
}, []);

export const APP_STORE_LINKS: Record<string, string> = {
  'Extend B2B Buying':                  'https://apps.shopify.com/quick-order-b2b-and-wholesale',
  'Extend POS for B2B & Wholesale':     'https://apps.shopify.com/pos-for-b2b-and-wholesale',
  'Extend POS for B2B':                 'https://apps.shopify.com/pos-for-b2b-and-wholesale',
  'Extend B2B Address Book':            'https://apps.shopify.com/extend-b2b-address-book',
  'Extend Product Configurator':        'https://apps.shopify.com/b2b-product-configurator',
  'Extend B2B Onboarding':              'https://apps.shopify.com/extend-b2b-onboarding',
  'Extend Projects & Quotes':           'https://extendcommerce.com',
  'Extend Dealer Locator':              'https://extendcommerce.com',
  'Extend Inventory Forecast AI':       'https://extendcommerce.com',
};

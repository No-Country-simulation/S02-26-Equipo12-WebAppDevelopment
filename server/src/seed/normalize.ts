import type { RawAlgoliaProduct } from './crawler';

export type NormalizedProduct = {
  name: string;
  description: string | null;
  brand: string;
  price: number;
  stock: number;
  handle: string;
  image: string | null;
  sizeRanges: Array<{
    sizeLabel: string;
    minValue: number;
    maxValue: number;
  }>;
};

const SIZE_ORDER = [
  'XXXS',
  'XXS',
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'XXXL',
  '4XL',
  '5XL',
];

const cleanText = (value: string | null | undefined): string =>
  (value ?? '').trim();

const normalizePrice = (product: RawAlgoliaProduct): number | null => {
  const value = product.price ?? product.market_pricing_eur?.price ?? null;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return null;
  }

  return value;
};

const getSizeLabel = (product: RawAlgoliaProduct): string | null => {
  const fromMeta = cleanText(product.meta?.custom?.size_name);
  const option1 = cleanText(product.option1);
  const option2 = cleanText(product.option2 ?? undefined);

  return fromMeta || option1 || option2 || null;
};

const buildSizeRanges = (
  variants: RawAlgoliaProduct[],
): NormalizedProduct['sizeRanges'] => {
  const sizeSet = new Set<string>();

  for (const variant of variants) {
    const sizeLabel = getSizeLabel(variant);
    if (sizeLabel) {
      sizeSet.add(sizeLabel);
    }
  }

  const labels = Array.from(sizeSet);
  const unknownLabels: string[] = [];
  const known = labels
    .filter((label) => SIZE_ORDER.includes(label.toUpperCase()))
    .sort((a, b) => SIZE_ORDER.indexOf(a.toUpperCase()) - SIZE_ORDER.indexOf(b.toUpperCase()));

  for (const label of labels) {
    if (!known.includes(label)) {
      unknownLabels.push(label);
    }
  }

  unknownLabels.sort((a, b) => a.localeCompare(b));

  const ordered = [...known, ...unknownLabels];

  return ordered.map((sizeLabel, index) => ({
    sizeLabel,
    minValue: index + 1,
    maxValue: index + 1,
  }));
};

export const normalizeProduct = (
  product: RawAlgoliaProduct,
  variants: RawAlgoliaProduct[],
): NormalizedProduct | null => {
  const name = cleanText(product.title);
  const brand = cleanText(product.vendor);
  const handle = cleanText(product.handle);
  const price = normalizePrice(product);

  const base = variants[0] ?? product;
  const imageUrl = cleanText(base.product_image) || null;

  if (!name || !brand || !handle || price === null) {
    return null;
  }

  const description = cleanText(product.body_html_safe) || null;
  const hasStock = variants.some((variant) => Boolean(variant.inventory_available));
  const sizeRanges = buildSizeRanges(variants);

  return {
    name,
    description,
    brand,
    price,
    stock: hasStock ? 1 : 0,
    handle,
    image: imageUrl,
    sizeRanges,
  };
};

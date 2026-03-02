import { getCollection } from "./getCollection";
import type { Product, ProductListItem, ProductPdpItem } from "./types";

export const getProduct = async (
  slug: string,
  page = 0,
): Promise<ProductListItem[]> => {
  const collectionId = await getCollection(slug);

  if (!collectionId) {
    throw new Error("No se pudo obtener el collection_id");
  }

  const res = await fetch(
    "https://07meeixg9b-dsn.algolia.net/1/indexes/*/queries",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-algolia-application-id": "07MEEIXG9B",
        "x-algolia-api-key": "622026376cff99b9aec6f2409c29ec2e",
      },
      body: JSON.stringify({
        requests: [
          {
            indexName: "shopify_horze_products_spain_es",
            params: `clickAnalytics=true&distinct=true&facetingAfterDistinct=true&filters=collection_ids:"${collectionId}"&hitsPerPage=40&page=${page}`,
          },
        ],
      }),
    },
  );

  const data = await res.json();
  const hits = data.results?.[0]?.hits ?? [];

  return hits.map((item: Product): ProductListItem => {
    return {
      image: item.product_image ?? null,
      brand: item.vendor ?? null,
      name: item.title ?? null,
      price: item.price ?? item.market_pricing_eur?.price ?? null,
      handle: item.handle,
      horzeProductId: item.meta?.custom?.horze_product_id ?? null,
    };
  });
};

const PDP_ATTRIBUTES_TO_RETRIEVE =
  "id,handle,title,vendor,product_image,price,market_pricing_eur,inventory_available,sku,variant_title,option1,option2,meta";

type PdpSearchField = "meta.custom.horze_product_id" | "handle";

const fetchPdpHits = async (
  query: string,
  field: PdpSearchField,
): Promise<Product[]> => {
  const params = new URLSearchParams({
    query,
    clickAnalytics: "true",
    distinct: "false",
    hitsPerPage: "250",
    restrictSearchableAttributes: field,
    attributesToRetrieve: PDP_ATTRIBUTES_TO_RETRIEVE,
  });

  const res = await fetch(
    "https://07meeixg9b-dsn.algolia.net/1/indexes/*/queries",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-algolia-application-id": "07MEEIXG9B",
        "x-algolia-api-key": "622026376cff99b9aec6f2409c29ec2e",
      },
      body: JSON.stringify({
        requests: [
          {
            indexName: "shopify_horze_products_spain_es",
            params: params.toString(),
          },
        ],
      }),
    },
  );

  const data = await res.json();
  return data.results?.[0]?.hits ?? [];
};

const mapHitsToPdpItem = (hits: Product[]): ProductPdpItem | null => {
  if (!hits.length) {
    return null;
  }

  const sizes = new Set<string>();
  const variants = hits.map((item) => {
    const size =
      item.meta?.custom?.size_name?.trim() ||
      item.option1?.trim() ||
      item.option2?.trim() ||
      null;

    if (size) {
      sizes.add(size);
    }

    return {
      id: item.id,
      sku: item.sku,
      variantTitle: item.variant_title,
      size,
      color: item.option2,
      price: item.price ?? item.market_pricing_eur?.price ?? null,
      available: item.inventory_available,
    };
  });

  const base = hits[0];

  return {
    productId: base.id,
    handle: base.handle,
    title: base.title,
    brand: base.vendor,
    image: base.product_image ?? null,
    sizes: Array.from(sizes),
    variants,
  };
};

const getProductPdp = async (
  query: string,
  field: PdpSearchField,
  exactHandle?: string,
): Promise<ProductPdpItem | null> => {
  const hits = await fetchPdpHits(query, field);
  const sourceHits = exactHandle
    ? hits.filter((item) => item.handle === exactHandle)
    : hits;

  return mapHitsToPdpItem(sourceHits.length ? sourceHits : hits);
};

export const getProductPdpById = async (
  horze_product_id: string,
): Promise<ProductPdpItem | null> => {
  return getProductPdp(
    horze_product_id.trim(),
    "meta.custom.horze_product_id",
  );
};

export const getProductPdpByHandle = async (
  handle: string,
): Promise<ProductPdpItem | null> => {
  const normalizedHandle = handle.trim();
  return getProductPdp(normalizedHandle, "handle", normalizedHandle);
};

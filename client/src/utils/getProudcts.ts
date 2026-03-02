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

export const getProductPdpById = async (
  horze_product_id: string,
): Promise<ProductPdpItem | null> => {
  const params = new URLSearchParams({
    query: horze_product_id.trim(),
    clickAnalytics: "true",
    distinct: "false",
    hitsPerPage: "250",
    restrictSearchableAttributes: "meta.custom.horze_product_id",
    attributesToRetrieve:
      "id,handle,title,vendor,product_image,price,market_pricing_eur,inventory_available,sku,variant_title,option1,option2,meta",
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
  const hits: Product[] = data.results?.[0]?.hits ?? [];

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

export const getProductPdpByHandle = async (
  handle: string,
): Promise<ProductPdpItem | null> => {
  const normalizedHandle = handle.trim();

  const params = new URLSearchParams({
    query: normalizedHandle,
    clickAnalytics: "true",
    distinct: "false",
    hitsPerPage: "250",
    restrictSearchableAttributes: "handle",
    attributesToRetrieve:
      "id,handle,title,vendor,product_image,price,market_pricing_eur,inventory_available,sku,variant_title,option1,option2,meta",
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
  const hits: Product[] = data.results?.[0]?.hits ?? [];

  const scopedHits = hits.filter((item) => item.handle === normalizedHandle);
  const sourceHits = scopedHits.length ? scopedHits : hits;

  if (!sourceHits.length) {
    return null;
  }

  const sizes = new Set<string>();
  const variants = sourceHits.map((item) => {
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

  const base = sourceHits[0];

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

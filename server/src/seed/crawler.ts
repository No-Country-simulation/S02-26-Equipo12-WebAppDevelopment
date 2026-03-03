export type RawAlgoliaProduct = {
  id: number;
  handle: string;
  title: string;
  vendor: string;
  product_image?: string | null;
  body_html_safe?: string;
  price?: number | null;
  market_pricing_eur?: {
    price?: number | null;
  };
  inventory_available?: boolean;
  meta?: {
    custom?: {
      horze_product_id?: string;
      size_name?: string;
    };
  };
  option1?: string;
  option2?: string | null;
  variant_title?: string;
  sku?: string;
};

const REQUEST_TIMEOUT_MS = Number(process.env.SEED_REQUEST_TIMEOUT_MS ?? 20000);
const REQUEST_RETRIES = Number(process.env.SEED_REQUEST_RETRIES ?? 2);

const fetchWithTimeout = async (url: string, init?: RequestInit): Promise<Response> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= REQUEST_RETRIES + 1; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        ...init,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return response;
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;

      if (attempt <= REQUEST_RETRIES) {
        continue;
      }
    }
  }

  throw lastError ?? new Error('Request failed without a specific error');
};

const ALGOLIA_URL = 'https://07meeixg9b-dsn.algolia.net/1/indexes/*/queries';
const ALGOLIA_INDEX = 'shopify_horze_products_spain_es';
const ALGOLIA_HEADERS = {
  'Content-Type': 'application/json',
  'x-algolia-application-id': '07MEEIXG9B',
  'x-algolia-api-key': '622026376cff99b9aec6f2409c29ec2e',
};

export const getCollectionIdFromUrl = async (
  collectionUrl: string,
): Promise<string | null> => {
  const normalized = collectionUrl.endsWith('.json')
    ? collectionUrl
    : `${collectionUrl}.json`;

  const res = await fetchWithTimeout(normalized);
  if (!res.ok) {
    return null;
  }

  const data = await res.json() as { collection?: { id?: number | string } };
  if (!data.collection?.id) {
    return null;
  }

  return String(data.collection.id);
};

export const fetchCollectionProducts = async (
  collectionId: string,
  page: number,
): Promise<RawAlgoliaProduct[]> => {
  let response: Response;
  try {
    response = await fetchWithTimeout(ALGOLIA_URL, {
      method: 'POST',
      headers: ALGOLIA_HEADERS,
      body: JSON.stringify({
        requests: [
          {
            indexName: ALGOLIA_INDEX,
            params: `clickAnalytics=true&distinct=true&facetingAfterDistinct=true&filters=collection_ids:"${collectionId}"&hitsPerPage=40&page=${page}`,
          },
        ],
      }),
    });
  } catch {
    return [];
  }

  if (!response.ok) {
    return [];
  }

  const data = await response.json() as {
    results?: Array<{ hits?: RawAlgoliaProduct[] }>;
  };

  return data.results?.[0]?.hits ?? [];
};

export const fetchProductVariantsByHandle = async (
  handle: string,
): Promise<RawAlgoliaProduct[]> => {
  const params = new URLSearchParams({
    query: handle,
    clickAnalytics: 'true',
    distinct: 'false',
    hitsPerPage: '250',
    restrictSearchableAttributes: 'handle',
    attributesToRetrieve:
      'id,handle,title,vendor,product_image,price,market_pricing_eur,inventory_available,sku,variant_title,option1,option2,meta,body_html_safe',
  });

  let response: Response;
  try {
    response = await fetchWithTimeout(ALGOLIA_URL, {
      method: 'POST',
      headers: ALGOLIA_HEADERS,
      body: JSON.stringify({
        requests: [
          {
            indexName: ALGOLIA_INDEX,
            params: params.toString(),
          },
        ],
      }),
    });
  } catch {
    return [];
  }

  if (!response.ok) {
    return [];
  }

  const data = await response.json() as {
    results?: Array<{ hits?: RawAlgoliaProduct[] }>;
  };

  const hits = data.results?.[0]?.hits ?? [];
  return hits.filter((hit) => hit.handle === handle);
};

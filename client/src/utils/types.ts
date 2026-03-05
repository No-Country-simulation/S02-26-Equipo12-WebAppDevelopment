export type Product = {
    _tags:                         string[];
    barcode:                       string;
    body_html_safe:                string;
    collection_ids:                number[];
    collections:                   string[];
    compare_at_price:              number | null;
    created_at:                    string;
    handle:                        string;
    id:                            number;
    image:                         string | null;
    inventory_available:           boolean;
    inventory_policy:              string;
    meta:                          ProductMeta;
    named_tags:                    NamedTags;
    named_tags_names:              string[];
    option1:                       string;
    option2:                       string | null;
    option3:                       string | null;
    option_names:                  string[];
    options:                       NamedTags;
    position:                      number;
    price:                         number | null;
    price_range:                   string;
    price_ratio:                   number;
    product_image:                 string | null;
    product_type:                  string;
    published_at:                  string;
    sku:                           string;
    tags:                          string[];
    taxable:                       boolean;
    template_suffix:               string | null;
    title:                         string;
    updated_at:                    string;
    variant_title:                 string;
    variants_compare_at_price_max: number;
    variants_compare_at_price_min: number;
    variants_count:                number;
    variants_max_price:            number;
    variants_min_price:            number;
    vendor:                        string;
    SKU_IsNew:                     string;
    SKU_CurrentStatus:             string;
    SKU_OrderIntake:               number;
    SKU_OI_Qty:                    number;
    SKU_CMII_Total:                number;
    SKU_CMII_Percent:              number;
    Variant_OrderIntake:           number;
    Variant_OI_Qty:                number;
    Variant_CMII_Total:            number;
    Variant_CMII_Percent:          number;
    Product_OrderIntake:           number;
    Product_OI_Qty:                number;
    Product_CMII_Total:            number;
    Product_CMII_Percent:          number;
    Product_CriticalSizeStock:     number;
    ABC_Class:                     string;
    market_pricing_eur?:           MarketPricingEur;
    objectID:                      string;
    _snippetResult?:               SnippetResult;
    _highlightResult?:             HighlightResult;
}

export type ProductListItem = {
    image: string | null;
    brand: string | null;
    name: string | null;
    price: number | null;
    handle: string;
    horzeProductId: string | null;
}

export type ProductVariantItem = {
    id: number;
    sku: string;
    variantTitle: string;
    size: string | null;
    color: string | null;
    price: number | null;
    available: boolean;
};

export type ProductPdpItem = {
    productId: number;
    handle: string;
    title: string;
    brand: string;
    image: string | null;
    sizes: string[];
    features: string | null;
    description: string | null;
    season: string | null;
    variants: ProductVariantItem[];
};

export type HighlightResult = {
    handle: Handle;
    meta:   HighlightResultMeta;
    sku:    Handle;
    title:  Handle;
    vendor: Handle;
}

export type Handle = {
    value:        string;
    matchLevel:   string;
    matchedWords: string[];
}

export type HighlightResultMeta = {
    custom: PurpleCustom;
}

export type PurpleCustom = {
    horze_product_id:     Handle;
    product_bulletpoints: Handle;
}

export type SnippetResult = {
    body_html_safe: BodyHTMLSafe;
}

export type BodyHTMLSafe = {
    value:      string;
    matchLevel: string;
}

export type MarketPricingEur = {
    price:                         number | null;
    compare_at_price:              number | null;
    price_ratio:                   number;
    price_range:                   string;
    variants_min_price:            number;
    variants_max_price:            number;
    variants_compare_at_price_min: number;
    variants_compare_at_price_max: number;
}

export type ProductMeta = {
    algolia: Algolia;
    custom:  FluffyCustom;
    select:  Select;
}

export type Algolia = {
    product_card_details: string;
    unit_measures:        string;
}

export type FluffyCustom = {
    base_color:                   string;
    canonical_url:                string;
    discount_details:             string;
    discount_hrzat:               number;
    discount_hrzbe:               number;
    discount_hrzch:               number;
    discount_hrzcz:               number;
    discount_hrzde:               number;
    discount_hrzdk:               number;
    discount_hrzes:               number;
    discount_hrzeu:               number;
    discount_hrzfi:               number;
    discount_hrzfr:               number;
    discount_hrzie:               number;
    discount_hrzit:               number;
    discount_hrznl:               number;
    discount_hrzno:               number;
    discount_hrzpl:               number;
    discount_hrzse:               number;
    discount_hrzuk:               number;
    facing:                       string;
    features:                     string;
    gender:                       string;
    grip:                         string;
    horze_product_id:             string;
    is_hero:                      string;
    product_bulletpoints:         string;
    product_title:                string;
    reference_size:               string;
    season:                       string;
    size_name:                    string;
    stock_availability_indicator: string;
    waist:                        string;
}

export type Select = {
    color: string;
}

export type NamedTags = Record<string, string | string[] | null>;

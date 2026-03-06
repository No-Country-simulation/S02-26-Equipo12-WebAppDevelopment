import { attemp } from "../utils/attemp";

import type {
  Category,
  Product,
  Products,
} from "../interfaces/product.interface";

const BASE_URL = import.meta.env.PUBLIC_SERVER_URL;

export const getProducts = async (page = 1) => {
  const { data, error } = await attemp<Products>(async () => {
    const res = await fetch(`${BASE_URL}/products?page=${page}`);

    if (!res.ok) {
      throw new Error("Error fetching products");
    }

    return res.json();
  });

  return { data, error };
};

export const getProductById = async (productId: string, page = 1) => {
  const { data, error } = await attemp<Product>(async () => {
    const res = await fetch(`${BASE_URL}/products/${productId}`);

    if (!res.ok) {
      throw new Error("Error fetching product");
    }

    return res.json();
  });

  return { data, error };
};

export const getProductsByCategoryId = async (categoryId: string, page = 1) => {
  const { data, error } = await attemp<Products>(async () => {
    const res = await fetch(
      `${BASE_URL}/products/category/${categoryId}?page=${page}`,
    );

    if (!res.ok) {
      throw new Error("Error fetching products");
    }

    return res.json();
  });

  return { data, error };
};

export const getProductsBySubcategoryId = async (
  subcategoryId: string,
  page = 1,
) => {
  const { data, error } = await attemp<Products>(async () => {
    const res = await fetch(
      `${BASE_URL}/products/subcategory/${subcategoryId}?page=${page}`,
    );

    if (!res.ok) {
      throw new Error("Error fetching products");
    }

    return res.json();
  });

  return { data, error };
};

export const getRecommendations = async (
  riderId: string,
  horseId: string,
  msg: string,
) => {
  const { data, error } = await attemp<Category[]>(async () => {
    const res = await fetch(`${BASE_URL}/chat/recommend-products`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        riderId,
        horseId,
        userText: msg,
      }),
    });

    if (!res.ok) {
      throw new Error("Error fetching recommedations");
    }

    return res.json();
  });

  return { data, error };
};
export const getCategories = async () => {
  const { data, error } = await attemp<Category[]>(async () => {
    const res = await fetch(`${BASE_URL}/categories`);

    if (!res.ok) {
      throw new Error("Error fetching categories");
    }

    return res.json();
  });

  return { data, error };
};

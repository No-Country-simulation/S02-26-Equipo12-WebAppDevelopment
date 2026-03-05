export interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  subCategories?: Category[];
  categoryId?: string;
}

export interface Products {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Product {
  id: string;
  name: string;
  description: null | string;
  image: string;
  price: string;
  stock: number;
  brandId: string;
  subCategoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

import { Product, SubCategory } from "../models";

interface PaginationOptions {
  page?: number;
  limit?: number;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ProductService {
  async getAll(
    options: PaginationOptions = {},
  ): Promise<PaginatedResult<Product>> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, options.limit || 10);
    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
      limit,
      offset,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async getById(id: string): Promise<Product> {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  async create(data: Partial<Product>): Promise<Product> {
    return await Product.create(data as any);
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const product = await this.getById(id);
    await product.update(data);
    return product;
  }

  async delete(id: string): Promise<{ message: string }> {
    const product = await this.getById(id);
    await product.destroy();
    return { message: "Product deleted successfully" };
  }

  async getByCategory(
    categoryId: string,
    options: PaginationOptions = {},
  ): Promise<PaginatedResult<Product>> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, options.limit || 10);
    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
      limit,
      offset,
      distinct: true,
      include: [
        {
          model: SubCategory,
          required: true,
          where: { categoryId: categoryId },
        },
      ],
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async getBySubCategory(
    subCategoryId: string,
    options: PaginationOptions = {},
  ): Promise<PaginatedResult<Product>> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, options.limit || 10);
    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
      where: { subCategoryId },
      limit,
      offset,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}

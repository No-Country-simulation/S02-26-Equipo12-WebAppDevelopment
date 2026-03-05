import { Request, Response } from "express";

import { ProductService } from "../services/product.service";

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  public async getProducts(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this.productService.getAll({ page, limit });

    res.json(result);
  }

  public async getProductById(req: Request, res: Response) {
    const id = req.params.id as string;
    const product = await this.productService.getById(id);

    res.json(product);
  }

  public async createProduct(req: Request, res: Response) {
    const product = await this.productService.create(req.body);

    res.status(201).json(product);
  }

  public async updateProduct(req: Request, res: Response) {
    const id = req.params.id as string;
    const product = await this.productService.update(id, req.body);

    res.json(product);
  }

  public async deleteProduct(req: Request, res: Response) {
    const id = req.params.id as string;
    const result = await this.productService.delete(id);

    res.json(result);
  }

  public async getProductsByCategory(req: Request, res: Response) {
    const categoryId = req.params.categoryId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this.productService.getByCategory(categoryId, { page, limit });

    res.json(result);
  }

  public async getProductsBySubCategory(req: Request, res: Response) {
    const subCategoryId = req.params.subCategoryId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this.productService.getBySubCategory(subCategoryId, { page, limit });

    res.json(result);
  }
}

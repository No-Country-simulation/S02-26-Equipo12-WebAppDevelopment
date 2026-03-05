import { Request, Response } from "express";

import { CategoryService } from "../services/category.service";

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  public async getCategories(_req: Request, res: Response) {
    const categories = await this.categoryService.getAllWithSubCategories();

    res.json(categories);
  }

  public async getCategoryById(req: Request, res: Response) {
    const id = req.params.id as string;
    const category = await this.categoryService.getByIdWithSubCategories(id);

    res.json(category);
  }
}

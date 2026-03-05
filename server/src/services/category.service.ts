import { Category, SubCategory } from "../models";

export class CategoryService {
  async getAllWithSubCategories() {
    const categories = await Category.findAll({
      include: [{ model: SubCategory, as: "subCategories" }],
    });

    return categories;
  }

  async getByIdWithSubCategories(id: string) {
    const category = await Category.findByPk(id, {
      include: [{ model: SubCategory, as: "subCategories" }],
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  }
}

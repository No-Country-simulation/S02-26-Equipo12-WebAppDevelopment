import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { CategoryService } from "../services/category.service";

export class CategoryRoutes {
  static get routes() {
    const router = Router();

    const service = new CategoryService();
    const controller = new CategoryController(service);

    router.get("/", controller.getCategories.bind(controller));
    router.get("/:id", controller.getCategoryById.bind(controller));

    return router;
  }
}

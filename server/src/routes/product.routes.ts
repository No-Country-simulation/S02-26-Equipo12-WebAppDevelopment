import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { ProductService } from "../services/product.service";

export class ProductRoutes {
  static get routes() {
    const router = Router();

    const service = new ProductService();
    const controller = new ProductController(service);

    router.get("/", controller.getProducts.bind(controller));
    router.get("/category/:categoryId", controller.getProductsByCategory.bind(controller));
    router.get("/subcategory/:subCategoryId", controller.getProductsBySubCategory.bind(controller));
    router.get("/:id", controller.getProductById.bind(controller));
    router.post("/", controller.createProduct.bind(controller));
    router.put("/:id", controller.updateProduct.bind(controller));
    router.delete("/:id", controller.deleteProduct.bind(controller));

    return router;
  }
}

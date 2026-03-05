import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { ProductService } from "../services/product.service";

export class ProductRoutes {
  static get routes() {
    const router = Router();

    const service = new ProductService();
    const controller = new ProductController(service);

    /**
     * @swagger
     * /products:
     *   get:
     *     tags: [Products]
     *     summary: Get all products
     *     responses:
     *       200:
     *         description: List of all products
     */
    router.get("/", controller.getProducts.bind(controller));

    /**
     * @swagger
     * /products/category/{categoryId}:
     *   get:
     *     tags: [Products]
     *     summary: Get products by category
     *     parameters:
     *       - in: path
     *         name: categoryId
     *         required: true
     *         schema:
     *           type: string
     *         description: Category ID
     *     responses:
     *       200:
     *         description: List of products in the category
     */
    router.get("/category/:categoryId", controller.getProductsByCategory.bind(controller));

    /**
     * @swagger
     * /products/subcategory/{subCategoryId}:
     *   get:
     *     tags: [Products]
     *     summary: Get products by subcategory
     *     parameters:
     *       - in: path
     *         name: subCategoryId
     *         required: true
     *         schema:
     *           type: string
     *         description: SubCategory ID
     *     responses:
     *       200:
     *         description: List of products in the subcategory
     */
    router.get("/subcategory/:subCategoryId", controller.getProductsBySubCategory.bind(controller));

    /**
     * @swagger
     * /products/{id}:
     *   get:
     *     tags: [Products]
     *     summary: Get product by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Product ID
     *     responses:
     *       200:
     *         description: Product details
     *       404:
     *         description: Product not found
     */
    router.get("/:id", controller.getProductById.bind(controller));

    /**
     * @swagger
     * /products:
     *   post:
     *     tags: [Products]
     *     summary: Create a new product
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               image:
     *                 type: string
     *               price:
     *                 type: number
     *               stock:
     *                 type: integer
     *               brandId:
     *                 type: string
     *               subCategoryId:
     *                 type: string
     *     responses:
     *       201:
     *         description: Product created successfully
     */
    router.post("/", controller.createProduct.bind(controller));

    /**
     * @swagger
     * /products/{id}:
     *   put:
     *     tags: [Products]
     *     summary: Update a product
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Product ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               image:
     *                 type: string
     *               price:
     *                 type: number
     *               stock:
     *                 type: integer
     *               brandId:
     *                 type: string
     *               subCategoryId:
     *                 type: string
     *     responses:
     *       200:
     *         description: Product updated successfully
     *       404:
     *         description: Product not found
     */
    router.put("/:id", controller.updateProduct.bind(controller));

    /**
     * @swagger
     * /products/{id}:
     *   delete:
     *     tags: [Products]
     *     summary: Delete a product
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Product ID
     *     responses:
     *       200:
     *         description: Product deleted successfully
     *       404:
     *         description: Product not found
     */
    router.delete("/:id", controller.deleteProduct.bind(controller));

    return router;
  }
}

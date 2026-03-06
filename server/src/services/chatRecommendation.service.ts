import { Op } from "sequelize"

import { Product } from "../models/productModel";
import { SubCategory } from "../models/subCategoryModel"; // asegúrate de tener este modelo
import { RecommendationService } from "./recommendation.service";
import { EngineStatus } from "./recommendation.engine";

export class ChatRecommendationService {

  private recommendationService = new RecommendationService();

  /**
   * Recomendación de productos a partir del nombre de la subcategoría
   */
  async recommendProducts(
    riderId: string,
    horseId: string,
    subCategoryName: string
  ) {

     // 1️⃣ Buscar subcategoría de manera flexible
    const subCategory = await SubCategory.findOne({
      where: {
        name: { [Op.iLike]: `%${subCategoryName}%` } // coincidencia parcial, case-insensitive
      }
    });

    if (!subCategory) {
      console.warn("SubCategory not found:", subCategoryName);
      return [];
    }

    const subCategoryId = subCategory.id;

    // 2️⃣ Buscar productos de esa subcategoría
    const products = await Product.findAll({
      where: { subCategoryId },
      limit: 10
    });

    console.log("products found:", products.length);

    const results: any[] = [];

    for (const product of products) {

      console.log("testing product:", product.id);

      const engineResult = await this.recommendationService.getRecommendations(
        riderId,
        horseId,
        product.id
      );

      console.log("engine result:", engineResult);

      if (
        engineResult.status === EngineStatus.OK &&
        engineResult.results &&
        engineResult.results.length > 0
      ) {
        const bestSize = engineResult.results[0].sizeLabel;

        results.push({
          productId: product.id,
          name: product.name,
          description: product.description,
          image: product.image,
          recommendedSize: bestSize
        });
      }

      if (results.length === 3) break; // limitar resultados
    }

    return results;
  }
}
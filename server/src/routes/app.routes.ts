import { Router } from "express";

import { AuthRoutes } from "./auth.routes";
import { CategoryRoutes } from "./category.routes";
import { ExampleRoutes } from "./example.routes";
import { ProductRoutes } from "./product.routes";
import { RiderMeasurementsRoutes } from "./riderMeasurements.routes";
import { HorseRoutes } from "./horse.routes";
import { HorseMeasurementsRoutes } from "./horseMeasurements.routes";
import { AIRoutes } from "./ai.routes";
import { RecommendationRoutes } from "./recommendation.routes"

export class AppRoutes {
  static get routes() {
    const router = Router();

    router.use("/example", ExampleRoutes.routes);

    //Autentication
    router.use("/auth", AuthRoutes.routes);

    //Rider Measurements
    router.use("/riders", RiderMeasurementsRoutes.routes);

    // Products
    router.use("/products", ProductRoutes.routes);

    // Categories
    router.use("/categories", CategoryRoutes.routes);

    //Horses
    router.use("/riders", HorseRoutes.routes);

    //Horse Measurements
    router.use("/horses", HorseMeasurementsRoutes.routes);
    
    // AI
    router.use("/api/v1/ai", AIRoutes);

    //Recommendations
    router.use("/recommendations", RecommendationRoutes.routes);

    return router
  }
}

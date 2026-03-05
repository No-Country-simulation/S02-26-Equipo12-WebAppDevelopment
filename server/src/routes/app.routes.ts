import { Router } from "express";

import { AuthRoutes } from "./auth.routes";
import { CategoryRoutes } from "./category.routes";
import { ExampleRoutes } from "./example.routes";
import { ProductRoutes } from "./product.routes";
import { RiderMeasurementsRoutes } from "./riderMeasurements.routes";

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

    return router;
  }
}

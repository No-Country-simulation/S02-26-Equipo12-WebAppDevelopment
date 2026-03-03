import { Router } from "express";
import { ExampleRoutes } from "./example.routes";
import { AuthRoutes } from "./auth.routes";
import { RiderMeasurementsRoutes } from "./riderMeasurements.routes";

export class AppRoutes {
  static get routes() {
    const router = Router()

    router.use('/example', ExampleRoutes.routes)

    //Autentication
    router.use('/auth', AuthRoutes.routes)

    //Rider Measurements
    router.use('/riders', RiderMeasurementsRoutes.routes)

    return router
  }
}
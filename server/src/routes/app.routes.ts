import { Router } from "express";
import { ExampleRoutes } from "./example.routes";
import { AuthRoutes } from "./auth.routes";
import { RiderRoutes } from "./rider.routes";

export class AppRoutes {
  static get routes() {
    const router = Router()

    router.use('/example', ExampleRoutes.routes)

    //Autentication
    router.use('/auth', AuthRoutes.routes)

    //RIDER
    router.use('/riders', RiderRoutes.routes)

    return router
  }
}
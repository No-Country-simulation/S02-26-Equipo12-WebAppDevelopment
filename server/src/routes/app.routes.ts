import { Router } from "express";
import { ExampleRoutes } from "./example.routes";
import { AuthRoutes } from "./auth.routes";

export class AppRoutes {
  static get routes() {
    const router = Router()

    router.use('/example', ExampleRoutes.routes)

    router.use('/auth', AuthRoutes.routes)

    return router
  }
}
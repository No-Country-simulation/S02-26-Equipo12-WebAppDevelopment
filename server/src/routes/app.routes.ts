import { Router } from "express";
import { ExampleRoutes } from "./example.routes";

export class AppRoutes {
  static get routes() {
    const router = Router()

    router.use('/example', ExampleRoutes.routes)

    return router
  }
}
import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

export class AuthRoutes {
    static get routes() {
        const router = Router()
        const controller = new AuthController()


        /**
         * @swagger
         * /auth/register:
         *   post:
         *     tags: [Auth]
         *     summary: Register a new rider
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *               lastName:
         *                 type: string
         *               email:
         *                 type: string
         *               password:
         *                 type: string
         *               birthDate:
         *                 type: string
         *               gender:
         *                 type: string
         *                 enum: [male, female]
         *     responses:
         *       201:
         *         description: Rider registered successfully
         */
        router.post('/register', controller.register)


        /**
        * @swagger
        * /auth/login:
        *   post:
        *     tags: [Auth]
        *     summary: Login a rider
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             type: object
        *             properties:
        *               email:
        *                 type: string
        *               password:
        *                 type: string
        *     responses:
        *       200:
        *         description: Login successful, returns token
        */
        router.post('/login', controller.login)


        return router
    }
}
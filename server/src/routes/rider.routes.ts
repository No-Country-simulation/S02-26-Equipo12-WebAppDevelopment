import { Router } from "express";
/*import {
    createRider,
    getRiderById,
    updateRider,
    deleteRider
} from "../controllers/riderController"; */

export class RiderRoutes {
    static get routes() {
        const router = Router();

        router.get("/", (_req, res) => {
            res.send("Riders endpoint up");
        });

        router.post("/", (_req, res) => {
            res.send('Create rider endpoint');
        });
        router.get("/:id", (_req, res) => {
            res.send('Get rider by id endpoint');
        });
        router.put("/:id", (_req, res) => {
            res.send('Update rider endpoint');
        });
        router.delete("/:id", (_req, res) => {
            res.send('Delete rider endpoint');
        });
        return router;
    }
}




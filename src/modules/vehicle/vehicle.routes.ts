import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth("admin"), vehicleController.addVehicle);
router.get("/", vehicleController.getVehicle);
router.get("/:vehicleId", vehicleController.getSingleVehicle);
router.put("/:vehicleId", vehicleController.updateVehicle);

export const vehicleRouter = router;

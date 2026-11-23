import express from "express";
import * as controller from "../controllers/patientController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protection de toutes les routes
router.use(authenticateToken);

// Consulter son profil
router.get("/profile", controller.getMyProfile);

// Créer son profil
router.post("/profile", controller.createMyProfile);

// Modifier son profil
router.put("/profile", controller.updateMyProfile);

export default router;
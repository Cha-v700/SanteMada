
import { Router } from "express";

import {
    getAll,
    getById,
    create,
    update,
    remove
} from "../controllers/medecinController.js";

import {
    authenticateToken,
    authorizeRoles
} from "../middlewares/authMiddleware.js";

const router = Router();

// Authentification obligatoire
router.use(authenticateToken);

// Lecture : admin et médecin
router.get(
    "/",
    authorizeRoles("admin", "medecin"),
    getAll
);

router.get(
    "/:id",
    authorizeRoles("admin", "medecin"),
    getById
);

// Création : admin uniquement
router.post(
    "/",
    authorizeRoles("admin"),
    create
);

// Modification : admin uniquement
router.put(
    "/:id",
    authorizeRoles("admin"),
    update
);

// Suppression : admin uniquement
router.delete(
    "/:id",
    authorizeRoles("admin"),
    remove
);

export default router;

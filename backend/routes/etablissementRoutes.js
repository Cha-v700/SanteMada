
import { Router } from "express";

import {
    getAll,
    getById,
    create,
    update,
    remove
} from "../controllers/etablissementController.js";

const router = Router();

// GET : récupérer tous les établissements et effectuer des recherches
router.get("/", getAll);

// GET : récupérer un établissement par ID
router.get("/:id", getById);

// POST : créer un établissement
router.post("/", create);

// PUT : modifier un établissement
router.put("/:id", update);

// DELETE : supprimer un établissement
router.delete("/:id", remove);

export default router;

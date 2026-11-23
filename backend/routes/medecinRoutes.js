import express from "express";
import * as controller from "../controllers/medecinController.js";

import {
    createMedecinValidator,
    idValidator,
    searchMedecinValidator,
    handleValidationErrors
} from "../validators/medecinValidator.js";

const router = express.Router();

// GET : tous les médecins avec filtres
router.get(
    "/",
    searchMedecinValidator,
    handleValidationErrors,
    controller.getAll
);

// GET : médecin par ID
router.get(
    "/:id",
    idValidator,
    handleValidationErrors,
    controller.getById
);

// POST : créer un médecin
router.post(
    "/",
    createMedecinValidator,
    handleValidationErrors,
    controller.create
);

// PUT : modifier un médecin
router.put(
    "/:id",
    idValidator,
    handleValidationErrors,
    controller.update
);

// PATCH : modification partielle
router.patch(
    "/:id",
    idValidator,
    handleValidationErrors,
    controller.patch
);

// DELETE : supprimer un médecin
router.delete(
    "/:id",
    idValidator,
    handleValidationErrors,
    controller.remove
);

export default router;
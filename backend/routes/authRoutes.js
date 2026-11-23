import express from "express";
import * as controller from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import * as repository from "../repositories/userRepository.js";

const router = express.Router();

// Test des routes d'authentification
router.get("/test", (req, res) => {
    res.json({
        message: "Routes Auth fonctionnelles !"
    });
});

// Inscription
router.post("/register", controller.register);

// Connexion
router.post("/login", controller.login);

// Profil utilisateur : route protégée
router.get("/me", authenticateToken, async (req, res) => {
    try {
        const user = await repository.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "Utilisateur introuvable"
            });
        }

        return res.status(200).json(user);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erreur serveur"
        });
    }
});

export default router;
import * as service from "../services/authService.js";

export async function register(req, res) {
    try {
        const user = await service.register(req.body);

        res.status(201).json({
            message: "Inscription réussie",
            user
        });
    } catch (error) {
        const status = error.message === "Cet email est déjà utilisé" ? 409 : 400;

        res.status(status).json({
            message: error.message
        });
    }
}

export async function login(req, res) {
    try {
        const result = await service.login(req.body);

        res.status(200).json({
            message: "Connexion réussie",
            ...result
        });
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
}
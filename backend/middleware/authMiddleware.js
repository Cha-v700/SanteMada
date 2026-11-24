import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
    // 1. Récupérer le header Authorization
    const authHeader = req.headers.authorization;

    // 2. Vérifier si le token existe
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Token manquant ou format invalide"
        });
    }

    // 3. Extraire le token
    const token = authHeader.split(" ")[1];

    // 4. Vérifier le token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 5. Enregistrer les informations de l'utilisateur
        req.user = decoded;

        // 6. Continuer vers la route suivante
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Token invalide ou expiré"
        });
    }
}
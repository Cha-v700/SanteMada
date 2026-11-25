import jwt from "jsonwebtoken";

// Middleware d'authentification JWT
export function authenticateToken(req, res, next) {

    // 1. Récupérer le header Authorization
    const authorization = req.headers.authorization;

    // 2. Vérifier si le header existe
    if (!authorization) {
        return res.status(401).json({
            message: "Token manquant"
        });
    }

    // 3. Vérifier le format Bearer Token
    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Format du token incorrect"
        });
    }

    // 4. Vérifier le token JWT
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 5. Récupérer les informations de l'utilisateur
        req.user = {
            id: decoded.sub,
            role: decoded.role
        };

        // 6. Continuer vers la route suivante
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Token invalide ou expiré"
        });
    }
}

import jwt from "jsonwebtoken";

// 1. Vérifier le token
export function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authentification requise"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch {
        return res.status(401).json({
            message: "Token invalide ou expiré"
        });
    }
}

// 2. Autoriser certains rôles
export function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentification requise"
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Vous n'avez pas la permission d'effectuer cette action"
            });
        }

        next();
    };
}

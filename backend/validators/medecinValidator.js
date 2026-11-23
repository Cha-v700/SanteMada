import { body, param, query, validationResult } from "express-validator";

// Validation de la création d'un médecin
export const createMedecinValidator = [
    body("nom")
        .trim()
        .notEmpty()
        .withMessage("Le nom est obligatoire")
        .isLength({ max: 100 })
        .withMessage("Le nom ne doit pas dépasser 100 caractères"),

    body("prenom")
        .trim()
        .notEmpty()
        .withMessage("Le prénom est obligatoire")
        .isLength({ max: 100 })
        .withMessage("Le prénom ne doit pas dépasser 100 caractères"),

    body("specialite")
        .trim()
        .notEmpty()
        .withMessage("La spécialité est obligatoire")
        .isLength({ max: 100 })
        .withMessage("La spécialité ne doit pas dépasser 100 caractères"),

    body("email")
        .optional({ values: "falsy" })
        .isEmail()
        .withMessage("L'adresse email est invalide"),

    body("telephone")
        .optional({ values: "falsy" })
        .isLength({ max: 20 })
        .withMessage("Le téléphone ne doit pas dépasser 20 caractères"),

    body("ville")
        .optional({ values: "falsy" })
        .isLength({ max: 100 })
        .withMessage("La ville ne doit pas dépasser 100 caractères")
];

// Validation d'un ID
export const idValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("L'ID doit être un entier positif")
];

// Validation de la pagination et recherche
export const searchMedecinValidator = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("La page doit être un entier supérieur à 0"),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage("La limite doit être comprise entre 1 et 50"),

    query("ville")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("La ville ne doit pas dépasser 100 caractères"),

    query("specialite")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("La spécialité ne doit pas dépasser 100 caractères")
];

// Middleware qui récupère les erreurs
export function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation échouée",
            errors: errors.array()
        });
    }

    next();
}
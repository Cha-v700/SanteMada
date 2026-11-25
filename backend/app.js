
import express from "express";
import cors from "cors";

import medecinRoutes from "./routes/medecinRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import etablissementRoutes from "./routes/etablissementRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// =====================================
// 1. MIDDLEWARES
// =====================================
app.use(cors());
app.use(express.json());

// =====================================
// 2. ROUTES API
// =====================================
app.use("/api/auth", authRoutes);
app.use("/api/medecins", medecinRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/etablissements", etablissementRoutes);

// =====================================
// 3. ROUTE D'ACCUEIL
// =====================================
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Bienvenue sur le backend SantéMada",
        statut: "Serveur opérationnel"
    });
});

// =====================================
// 4. TEST DU SERVEUR
// =====================================
app.get("/test-auth", (req, res) => {
    res.status(200).send("Les routes du serveur fonctionnent !");
});

// =====================================
// 5. ROUTE 404
// =====================================
app.use((req, res) => {
    res.status(404).json({
        message: `Route introuvable : ${req.method} ${req.originalUrl}`
    });
});

// =====================================
// 6. DEMARRAGE DU SERVEUR
// =====================================
app.listen(PORT, () => {
    console.log("--------------------------------");
    console.log(`SantéMada lancé sur http://localhost:${PORT}`);
    console.log("Routes chargées :");
    console.log("- /api/auth");
    console.log("- /api/medecins");
    console.log("- /api/patients");
    console.log("- /api/etablissements");
    console.log("--------------------------------");
});

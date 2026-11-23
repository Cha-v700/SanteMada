import express from "express";
import medecinRoutes from "./routes/medecinRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/medecins", medecinRoutes);
app.use("/api/patients", patientRoutes);

// Accueil
app.get("/", (req, res) => {
    res.json({
        message: "Bienvenue sur le backend SantéMada"
    });
});

// Test serveur
app.get("/test-auth", (req, res) => {
    res.send("Les routes du serveur fonctionnent !");
});

// Gestion des routes inexistantes
app.use((req, res) => {
    res.status(404).json({
        message: `Route introuvable : ${req.method} ${req.originalUrl}`
    });
});

// Démarrage
app.listen(PORT, () => {
    console.log(`Serveur demarre sur http://localhost:${PORT}`);
});
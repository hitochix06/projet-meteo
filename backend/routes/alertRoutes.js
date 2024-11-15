import express from "express";
import AlerteMeteo from "../models/AlerteMeteo.js";

const router = express.Router();
router.post("/alertes", async (req, res) => {
  try {
    const { stationId, titre, description, date } = req.body;
    const alerte = new AlerteMeteo();
    const id = await alerte.addAlerte(stationId, titre, description, date);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Route pour récupérer toutes les alertes d'une station
router.get("/alertes/:stationId", async (req, res) => {
  try {
    const { stationId } = req.params;
    const alerteModel = new AlerteMeteo();
    const alertes = await alerteModel.getAlertesByStation(stationId);
    res.json(alertes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour récupérer toutes les alertes
router.get("/alertes", async (req, res) => {
  try {
    const alerteModel = new AlerteMeteo();
    const alertes = await alerteModel.getAllAlertes();
    res.json(alertes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/alertes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Recherche de l'alerte avec l'ID: ${id}`);

    const alerteModel = new AlerteMeteo();
    const alerte = await alerteModel.getAlerteById(id);

    if (!alerte) {
      return res.status(404).json({ error: "Alerte non trouvée" });
    }

    console.log(`Alerte trouvée:`, alerte);
    res.json(alerte);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'alerte:", error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/alertes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Suppression de l'alerte avec l'ID: ${id}`);

    const alerteModel = new AlerteMeteo();
    const deletedRecords = await alerteModel.deleteAlerte(id);

    if (!deletedRecords) {
      return res.status(404).json({ error: "Alerte non trouvée" });
    }

    console.log(`Alerte supprimée avec succès.`);
    res.status(204).send();
  } catch (error) {
    console.error("Erreur lors de la suppression de l'alerte:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/alertes/:id", async (req, res) => {
  try {
    const { id } = req.params;  // ID de l'alerte à mettre à jour
    const { stationId, titre, description, date } = req.body; // Les données à mettre à jour

    console.log(`Mise à jour de l'alerte avec l'ID: ${id}`);

    // Créer une instance du modèle AlerteMeteo
    const alerteModel = new AlerteMeteo();

    // Mettre à jour l'alerte
    const updatedAlerte = await alerteModel.updateAlerte(id, {
      stationId,
      titre,
      description,
      date
    });

    // Vérifier si l'alerte existe
    if (!updatedAlerte) {
      return res.status(404).json({ error: "Alerte non trouvée" });
    }

    // Retourner la réponse avec l'alerte mise à jour
    console.log(`Alerte mise à jour:`, updatedAlerte);
    res.json(updatedAlerte);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'alerte:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
import express from "express";
import Prevision from "../models/Prevision.js";

const router = express.Router();
const previsionModel = new Prevision();

//  Récupérer toutes les prévisions
router.get("/previsions", async (req, res) => {
  try {
    const previsions = await previsionModel.getPrevisions();
    res.json(previsions);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des prévisions" });
  }
});

//  Ajouter une nouvelle prévision
router.post("/previsions", async (req, res) => {
  try {
    const { stationId, description, temperature, humidite, date } = req.body;
    const id = await previsionModel.addPrevision(
      stationId,
      description,
      temperature,
      humidite,
      date
    );
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout de la prévision" });
  }
});

// Mettre à jour une prévision par ID
router.put("/previsions/:id", async (req, res) => {
  try {
    const updatedPrevision = await previsionModel.updatePrevision(
      req.params.id,
      req.body
    );
    res.json(updatedPrevision);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la prévision" });
  }
});

// Supprimer une prévision par ID
router.delete("/previsions/:id", async (req, res) => {
  try {
    await previsionModel.deletePrevision(req.params.id);
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la prévision" });
  }
});

// Récupérer une prévision par ID
router.get("/previsions/:id", async (req, res) => {
  try {
    const prevision = await previsionModel.getPrevisionById(req.params.id);
    if (!prevision) {
      return res.status(404).json({ error: "Prévision non trouvée" });
    }
    res.json(prevision);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de la prévision" });
  }
});

export default router;

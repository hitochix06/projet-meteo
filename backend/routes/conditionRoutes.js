// backend/routes/conditionRoutes.js

import express from "express";
import ConditionActuelle from "../models/ConditionActuelle.js";

const router = express.Router();
const conditionModel = new ConditionActuelle();

// GET : Récupérer toutes les conditions actuelles
router.get("/conditions", async (req, res) => {
  try {
    const conditions = await conditionModel.getConditions();
    res.json(conditions);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération des conditions actuelles",
    });
  }
});

// GET : Récupérer une condition actuelle par ID
router.get("/conditions/:id", async (req, res) => {
  try {
    const condition = await conditionModel.getConditionById(req.params.id);
    if (!condition) {
      return res.status(404).json({ error: "Condition non trouvée" });
    }
    res.json(condition);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération de la condition actuelle",
    });
  }
});

// POST : Ajouter une nouvelle condition actuelle
router.post("/conditions", async (req, res) => {
  try {
    const { stationId, description, temperature, humidite } = req.body;
    const id = await conditionModel.addCondition(
      stationId,
      description,
      temperature,
      humidite
    );
    res.status(201).json({ id });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de l'ajout de la condition actuelle" });
  }
});

// PUT : Mettre à jour une condition actuelle par ID
router.put("/conditions/:id", async (req, res) => {
  try {
    const updatedCondition = await conditionModel.updateCondition(
      req.params.id,
      req.body
    );
    res.json(updatedCondition);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la mise à jour de la condition actuelle",
    });
  }
});

// DELETE : Supprimer une condition actuelle par ID
router.delete("/conditions/:id", async (req, res) => {
  try {
    await conditionModel.deleteCondition(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la suppression de la condition actuelle",
    });
  }
});

export default router;

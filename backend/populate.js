// backend/populate.js

import dotenv from "dotenv";
dotenv.config();

import Station from "./models/Station.js";
import ConditionActuelle from "./models/ConditionActuelle.js";
import Prevision from "./models/Prevision.js";
import AlerteMeteo from "./models/AlerteMeteo.js";

async function ajouterDonnees() {
  const stationModel = new Station();
  const conditionActuelleModel = new ConditionActuelle();
  const previsionModel = new Prevision();
  const alerteMeteoModel = new AlerteMeteo();

  try {
    // 1. Ajouter une station
    const stationId = await stationModel.addStation(
      "Station de Paris",
      48.8566, // Latitude
      2.3522, // Longitude
      35, // Altitude en mètres
      "France",
      "Paris"
    );

    // 2. Ajouter les conditions actuelles
    await conditionActuelleModel.addCondition(stationId, "Ensoleillé", 25, 60);

    // 3. Ajouter une prévision
    await previsionModel.addPrevision(
      stationId,
      "Pluvieux",
      22,
      70,
      "2024-04-27"
    );

    // 4. Ajouter une alerte météo
    await alerteMeteoModel.addAlerte(
      stationId,
      "Alerte Tempête",
      "Des vents violents attendus.",
      "2024-04-28"
    );

    console.log("Données ajoutées avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout des données :", error);
  }
}

ajouterDonnees();

import express from "express";
import Station from "../models/Station.js";
import ConditionActuelle from "../models/ConditionActuelle.js";
import Prevision from "../models/Prevision.js";
import AlerteMeteo from "../models/AlerteMeteo.js";
import base from "../config/airtable.js";

const router = express.Router();

// Route pour récupérer les stations depuis Airtable
router.get("/stations", async (req, res) => {
  try {
    // Récupérer toutes les stations
    const stationRecords = await base("Stations").select().all();

    // Récupérer toutes les données des autres tables
    const [conditionsRecords, previsionsRecords, alertesRecords] =
      await Promise.all([
        base("ConditionsActuelles").select().all(),
        base("Previsions").select().all(),
        base("AlertesMeteo").select().all(),
      ]);



    // Mapper les stations avec leurs données associées
    const stations = stationRecords.map((stationRecord) => {
      const stationId = stationRecord.id;



      const conditions = conditionsRecords
        .filter((record) => {
          
          return record.fields.Stations?.[0] === stationId;
        })
        .map((record) => ({
          id: record.id,
          description: record.fields.Description,
          temperature: record.fields.Temperature,
          humidite: record.fields.Humidite,
          dateReleve: record.fields.DateReleve,
        }));

      const previsions = previsionsRecords
        .filter((record) => record.fields.Stations?.[0] === stationId)
        .map((record) => ({
          id: record.id,
          description: record.fields.Description,
          temperature: record.fields.Temperature,
          humidite: record.fields.Humidite,
          date: record.fields.Date,
        }));

      const alertes = alertesRecords
        .filter((record) => record.fields.Stations?.[0] === stationId)
        .map((record) => ({
          id: record.id,
          titre: record.fields.Titre,
          description: record.fields.Description,
          date: record.fields.Date,
        }));



      // Retourner la station avec toutes ses données associées
      return {
        id: stationRecord.id,
        nom: stationRecord.fields.Nom,
        latitude: stationRecord.fields.Latitude,
        longitude: stationRecord.fields.Longitude,
        altitude: stationRecord.fields.Altitude,
        pays: stationRecord.fields.Pays,
        ville: stationRecord.fields.Ville,
        conditionsActuelles: conditions,
        previsions: previsions,
        alertes: alertes,
      };
    });

    res.json(stations);
  } catch (error) {
    console.error("Erreur détaillée:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route pour récupérer une station spécifique
router.get("/stations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer la station spécifique
    const stationRecord = await base("Stations").find(id);
    
    // Récupérer les données associées
    const [conditionsRecords, previsionsRecords, alertesRecords] = await Promise.all([
      base("ConditionsActuelles").select({
        filterByFormula: `{Stations} = '${id}'`
      }).all(),
      base("Previsions").select({
        filterByFormula: `{Stations} = '${id}'`
      }).all(),
      base("AlertesMeteo").select({
        filterByFormula: `{Stations} = '${id}'`
      }).all()
    ]);

    if (!stationRecord) {
      return res.status(404).json({ error: "Station non trouvée" });
    }

    // Formater la réponse
    const station = {
      id: stationRecord.id,
      ...stationRecord.fields,
      conditionsActuelles: conditionsRecords.map(record => ({
        id: record.id,
        description: record.fields.Description,
        temperature: record.fields.Temperature,
        humidite: record.fields.Humidite,
        dateReleve: record.fields.DateReleve,
      })),
      previsions: previsionsRecords.map(record => ({
        id: record.id,
        description: record.fields.Description,
        temperature: record.fields.Temperature,
        humidite: record.fields.Humidite,
        date: record.fields.Date,
      })),
      alertes: alertesRecords.map(record => ({
        id: record.id,
        titre: record.fields.Titre,
        description: record.fields.Description,
        date: record.fields.Date,
      }))
    };

    res.json(station);
  } catch (error) {
    console.error("Erreur détaillée:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route pour modifier une station
router.put("/stations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, latitude, longitude, altitude, pays, ville } = req.body;

    const updatedStation = await base("Stations").update([
      {
        id: id,
        fields: {
          Nom: nom,
          Latitude: latitude,
          Longitude: longitude,
          Altitude: altitude,
          Pays: pays,
          Ville: ville
        }
      }
    ]);

    if (!updatedStation || updatedStation.length === 0) {
      return res.status(404).json({ error: "Station non trouvée" });
    }

    res.json(updatedStation[0].fields);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour supprimer une station
router.delete("/stations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedStation = await base("Stations").destroy([id]);

    if (!deletedStation || deletedStation.length === 0) {
      return res.status(404).json({ error: "Station non trouvée" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour ajouter une station
router.post("/stations", async (req, res) => {
  try {
    const { nom, latitude, longitude, altitude, pays, ville } = req.body;
    const station = new Station();
    const id = await station.addStation(
      nom,
      latitude,
      longitude,
      altitude,
      pays,
      ville
    );
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour ajouter une condition actuelle
router.post("/conditions", async (req, res) => {
  try {
    const { stationId, description, temperature, humidite } = req.body;
    const condition = new ConditionActuelle();
    const id = await condition.addCondition(
      stationId,
      description,
      temperature,
      humidite
    );
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour ajouter une prévision
router.post("/previsions", async (req, res) => {
  try {
    const { stationId, description, temperature, humidite, date } = req.body;
    const prevision = new Prevision();
    const id = await prevision.addPrevision(
      stationId,
      description,
      temperature,
      humidite,
      date
    );
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour ajouter une alerte
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

export default router;

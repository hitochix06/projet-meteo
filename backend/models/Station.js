// backend/models/Station.js

import Airtable from "airtable";

export default class Station {
  #base;
  #table;

  constructor() {
    Airtable.configure({
      apiKey: process.env.AIRTABLE_TOKEN,
    });
    this.#base = Airtable.base(process.env.AIRTABLE_BASE_ID);
    this.#table = this.#base("Stations");
  }

  // Ajoute une nouvelle station
  async addStation(nom, latitude, longitude, altitude, pays, ville) {
    try {
      const stationData = {
        Nom: nom,
        Latitude: latitude,
        Longitude: longitude,
        Altitude: altitude,
        Pays: pays,
        Ville: ville,
      };

      const { id } = await this.#table.create([{ fields: stationData }]);
      return id;
    } catch (error) {
      console.error(`Erreur lors de l'ajout de la station : ${error.message}`);
      throw error;
    }
  }

  // Récupère toutes les stations
  async getAllStations() {
    try {
      const records = await this.#table.select().all();
      return records.map(record => ({
        id: record.id,
        nom: record.fields.Nom,
        latitude: record.fields.Latitude,
        longitude: record.fields.Longitude,
        altitude: record.fields.Altitude,
        pays: record.fields.Pays,
        ville: record.fields.Ville,
      }));
    } catch (error) {
      console.error(`Erreur lors de la récupération des stations : ${error.message}`);
      throw error;
    }
  }

  // Récupère une station par ID
  async getStationById(id) {
    try {
      const record = await this.#table.find(id);
      return {
        id: record.id,
        nom: record.fields.Nom,
        latitude: record.fields.Latitude,
        longitude: record.fields.Longitude,
        altitude: record.fields.Altitude,
        pays: record.fields.Pays,
        ville: record.fields.Ville,
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération de la station : ${error.message}`);
      throw error;
    }
  }

  // Met à jour une station par ID
  async updateStation(id, nom, latitude, longitude, altitude, pays, ville) {
    try {
      const updatedData = {
        Nom: nom,
        Latitude: latitude,
        Longitude: longitude,
        Altitude: altitude,
        Pays: pays,
        Ville: ville,
      };

      const updatedRecord = await this.#table.update([{ id, fields: updatedData }]);
      return updatedRecord[0].fields;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la station : ${error.message}`);
      throw error;
    }
  }

  // Supprime une station par ID
  async deleteStation(id) {
    try {
      const deletedRecords = await this.#table.destroy([id]);
      return deletedRecords.length > 0;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la station : ${error.message}`);
      throw error;
    }
  }
}

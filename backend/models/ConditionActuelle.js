import Airtable from "airtable";

export default class ConditionActuelle {
  #base;
  #table;

  constructor() {
    Airtable.configure({
      apiKey: process.env.AIRTABLE_TOKEN,
    });
    this.#base = Airtable.base(process.env.AIRTABLE_BASE_ID);
    this.#table = this.#base("ConditionsActuelles");
  }

  // Ajoute une condition actuelle
  async addCondition(stationId, description, temperature, humidite) {
    try {
      const conditionData = {
        Stations: [stationId],
        Description: description,
        Temperature: temperature,
        Humidite: humidite / 100,
      };

      const { id } = await this.#table.create([{ fields: conditionData }]);
      return id;
    } catch (error) {
      console.error(
        `Erreur lors de l'ajout de la condition actuelle : ${error.message}`
      );
      throw error;
    }
  }

  // Récupère toutes les conditions actuelles
  async getConditions() {
    try {
      const records = await this.#table.select().all();
      return records.map((record) => ({
        id: record.id,
        description: record.fields.Description,
        temperature: record.fields.Temperature,
        humidite: record.fields.Humidite,
        stationId: record.fields.Stations,
      }));
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des conditions actuelles : ${error.message}`
      );
      throw error;
    }
  }

  // Récupère une condition actuelle par ID
  async getConditionById(id) {
    try {
      const record = await this.#table.find(id);
      return {
        id: record.id,
        description: record.fields.Description,
        temperature: record.fields.Temperature,
        humidite: record.fields.Humidite,
        stationId: record.fields.Stations,
      };
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de la condition actuelle : ${error.message}`
      );
      throw error;
    }
  }

  // Met à jour une condition actuelle par ID
  async updateCondition(id, data) {
    try {
      const updatedRecord = await this.#table.update([{ id, fields: data }]);
      return updatedRecord[0].fields;
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour de la condition actuelle : ${error.message}`
      );
      throw error;
    }
  }

  // Supprime une condition actuelle par ID
  async deleteCondition(id) {
    try {
      await this.#table.destroy(id);
      return { success: true };
    } catch (error) {
      console.error(
        `Erreur lors de la suppression de la condition actuelle : ${error.message}`
      );
      throw error;
    }
  }
}

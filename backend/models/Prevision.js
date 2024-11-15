import Airtable from "airtable";

export default class Prevision {
  #base;
  #table;

  constructor() {
    Airtable.configure({
      apiKey: process.env.AIRTABLE_TOKEN,
    });
    this.#base = Airtable.base(process.env.AIRTABLE_BASE_ID);
    this.#table = this.#base("Previsions");
  }

  // Ajoute une prévision météo
  async addPrevision(stationId, description, temperature, humidite, date) {
    try {
      const previsionData = {
        Stations: [stationId],
        Description: description,
        Temperature: temperature,
        Humidite: humidite / 100,
        Date: date,
      };
      const { id } = await this.#table.create(previsionData);
      console.log(`Prévision ajoutée avec succès. ID: ${id}`);
      return id;
    } catch (error) {
      console.error(
        `Erreur lors de l'ajout de la prévision : ${error.message}`
      );
      throw error;
    }
  }

  // Récupère toutes les prévisions
  async getPrevisions() {
    try {
      const records = await this.#table.select().all();
      return records.map((record) => record.fields);
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des prévisions : ${error.message}`
      );
      throw error;
    }
  }

  // Récupère une prévision par ID
  async getPrevisionById(id) {
    try {
      const record = await this.#table.find(id);
      if (!record) {
        console.log(`Prévision non trouvée pour l'ID ${id}`);
        return null;
      }

      return {
        id: record.id,
        description: record.fields.Description,
        temperature: record.fields.Temperature,
        humidite: record.fields.Humidite,
        date: record.fields.Date,
        stationId: record.fields.Stations,
      };
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de la prévision : ${error.message}`
      );
      throw error;
    }
  }

  // Met à jour une prévision par ID
  async updatePrevision(id, data) {
    try {
      console.log(`Mise à jour de la prévision avec ID: ${id}`);
      console.log(`Données de mise à jour: ${JSON.stringify(data)}`);

      // Mappez les noms de champs de l'objet data aux noms de champs utilisés dans Airtable
      const updateData = {
        id: id,
        fields: {
          Description: data.description,
          Temperature: data.temperature,
          Humidite: data.humidite,
          Date: data.date,
          Stations: data.stationId, // Assurez-vous d'inclure les stations si nécessaire
        },
      };

      const updatedRecords = await this.#table.replace([updateData]);

      const updatedRecord = updatedRecords[0];
      console.log(
        `Prévision mise à jour avec succès. Données mises à jour: ${JSON.stringify(
          updatedRecord.fields
        )}`
      );
      return updatedRecord.fields;
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour de la prévision : ${error.message}`
      );
      throw error;
    }
  }
  // Supprime une prévision par ID
  async deletePrevision(id) {
    try {
      await this.#table.destroy(id);
      return { success: true };
    } catch (error) {
      console.error(
        `Erreur lors de la suppression de la prévision : ${error.message}`
      );
      throw error;
    }
  }
}

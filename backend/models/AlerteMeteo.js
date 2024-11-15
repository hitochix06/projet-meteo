import Airtable from "airtable";

export default class AlerteMeteo {
  #base;
  #table;

  constructor() {
    Airtable.configure({
      apiKey: process.env.AIRTABLE_TOKEN,
    });
    this.#base = Airtable.base(process.env.AIRTABLE_BASE_ID);
    this.#table = this.#base("AlertesMeteo");
  }

  /**
   * Ajoute une alerte météo.
   */
  async addAlerte(stationId, titre, description, date) {
    try {
      const alerteData = {
        Stations: [stationId],
        Titre: titre,
        Description: description,
        Date: date,
      };

      const { id } = await this.#table.create(alerteData);
      return id;
    } catch (error) {
      console.error(
          `Erreur lors de l'ajout de l'alerte météo : ${error.message}`
      );
      throw error;
    }
  }




  async getAllAlertes() {
    try {
      const records = await this.#table.select().all();

      return records.map((record) => ({
        id: record.id,
        titre: record.fields.Titre,
        description: record.fields.Description,
        date: record.fields.Date,
      }));
    } catch (error) {
      console.error(`Erreur lors de la récupération des alertes : ${error.message}`);
      throw error;
    }
  }
  async getAlertesByStation(stationId) {
    try {
      const records = await this.#table
          .select({
            filterByFormula: `{Stations} = '${stationId}'`,
          })
          .all();
      return records.map((record) => ({
        id: record.id,
        titre: record.fields.Titre,
        description: record.fields.Description,
        date: record.fields.Date,
      }));
    } catch (error) {
      console.error(`Erreur lors de la récupération des alertes pour la station ${stationId}: ${error.message}`);
      throw error;
    }
  }
  async getAlerteById(id) {
    try {
      const record = await this.#table.find(id);

      if (!record) {
        console.log(`Alerte non trouvée pour l'ID ${id}`);
        return null;
      }


      return {
        id: record.id,
        titre: record.fields.Titre,
        description: record.fields.Description,
        date: record.fields.Date,
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'alerte: ${error.message}`);
      throw error;
    }
  }






  /**
   * Met à jour une alerte existante.
   */
  async updateAlerte(id, titre, description, date) {
    try {
      const alerteData = {
        Titre: titre,
        Description: description,
        Date: date,
      };

      await this.#table.update(id, alerteData);
      return id;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'alerte ${id} : ${error.message}`);
      throw error;
    }
  }



  async deleteAlerte(id) {
    try {

      const deletedRecords = await this.#table.destroy([id]);

      if (deletedRecords.length === 0) {
        console.log(`Aucune alerte trouvée pour l'ID ${id}`);
        return null;
      }

      console.log(`Deleted ${deletedRecords.length} record(s)`);
      return deletedRecords;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'alerte: ${error.message}`);
      throw error;
    }
  }
}
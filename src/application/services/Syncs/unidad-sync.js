import { DatabaseConnection } from "../Database/db-service";
import { removeUnidades, saveUnidades } from "../Models";

export const UnidadSyncInit = async (unidades) => {
  try {
    const db = DatabaseConnection.getConnection();
    let deleteUnidad = await removeUnidades(db);

    if (deleteUnidad != 200) {
      return 500;
    }
    if (deleteUnidad == 200) {
      let saveUnidad = await saveUnidades(unidades, db);

      return saveUnidad;
    }
  } catch (error) {
    return error;
  }
};

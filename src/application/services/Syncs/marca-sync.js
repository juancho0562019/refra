import { DatabaseConnection } from "../Database/db-service";
import { removeMarca, saveMarcas } from "../Models";

export const MarcaSyncInit = async (marcas) => {
  try {
    const db = DatabaseConnection.getConnection();
    let deleteMarca = await removeMarca(db);
    if (deleteMarca != 200) {
      return 500;
    }
    if (deleteMarca == 200) {
      let saveMarca = await saveMarcas(marcas, db);

      return saveMarca;
    }
  } catch (error) {
    return error;
  }
};

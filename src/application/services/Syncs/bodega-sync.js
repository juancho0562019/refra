import { DatabaseConnection } from "../Database/db-service";
import { removeBodega, saveBodegas } from "../Models";

export const BodegaSyncInit = async (bodegas) => {
  try {
    const db = DatabaseConnection.getConnection();
    let deleteBodega = await removeBodega(db);
    if (deleteBodega != 200) {
      return 500;
    }
    if (deleteBodega == 200) {
      let saveBodega = await saveBodegas(bodegas, db);

      return saveBodega;
    }
  } catch (error) {
    return error;
  }
};

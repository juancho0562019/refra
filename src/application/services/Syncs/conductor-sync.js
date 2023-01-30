import { DatabaseConnection } from "../Database/db-service";
import { removeConductor, saveConductores } from "../Models";

export const ConductorSyncInit = async (conductores) => {
  try {
    const db = DatabaseConnection.getConnection();
    let deleteConductor = await removeConductor(db);
    console.log(deleteConductor);
    if (deleteConductor != 200) {
      return 500;
    }
    if (deleteConductor == 200) {
      let saveConductor = await saveConductores(conductores, db);
      console.log(saveConductor);
      return saveConductor;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

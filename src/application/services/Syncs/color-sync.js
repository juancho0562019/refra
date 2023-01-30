import { DatabaseConnection } from "../Database/db-service";
import { removeColor, saveColores } from "../Models";

export const ColorSyncInit = async (colores) => {
  try {
    const db = DatabaseConnection.getConnection();
    let deleteColor = await removeColor(db);
    if (deleteColor != 200) {
      return 500;
    }
    if (deleteColor == 200) {
      let saveColor = await saveColores(colores, db);

      return saveColor;
    }
  } catch (error) {
    return error;
  }
};

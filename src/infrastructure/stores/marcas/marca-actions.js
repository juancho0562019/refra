import {
  DatabaseConnection,
  getMarca,
  removeMarca,
} from "../../../application/services";
export const SET_MARCA = "SET_MARCA";
export const REMOVEMARCA = "REMOVEMARCA";
const db = DatabaseConnection.getConnection();

export const loadMarca = () => {
  return async (dispatch) => {
    try {
      const dbResult = await getMarca(db);
      dispatch({ type: SET_MARCA, marcas: dbResult.rows._array });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteMarca = () => {
  return async (dispatch) => {
    try {
      const dbResult = await removeMarca(db);
      dispatch({ type: REMOVEMARCA });
    } catch (err) {
      throw err;
    }
  };
};

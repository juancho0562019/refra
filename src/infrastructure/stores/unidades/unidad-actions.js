import {
  DatabaseConnection,
  getUnidades,
  removeUnidades,
} from "../../../application/services";
export const SET_UNIDAD = "SET_UNIDAD";
export const REMOVEUNIDADES = "REMOVEUNIDADES";
const db = DatabaseConnection.getConnection();
import Moment from "moment";
import { SAVEUNIDADES } from "../../../application/services/Database/sql";

export const loadUnidades = () => {
  return async (dispatch) => {
    try {
      const dbResult = await getUnidades(db);
      dispatch({ type: SET_UNIDAD, unidades: dbResult.rows._array });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteUnidades = () => {
  return async (dispatch) => {
    try {
      const dbResult = await removeUnidades(db);
      dispatch({ type: REMOVEUNIDADES });
    } catch (err) {
      throw err;
    }
  };
};

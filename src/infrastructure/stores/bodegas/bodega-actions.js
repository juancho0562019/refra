import {
  DatabaseConnection,
  getBodegas,
  removeBodega,
  getUnidades,
} from "../../../application/services";
export const SET_BODEGA = "SET_BODEGA";
export const REMOVEBODEGA = "REMOVEBODEGA";
const db = DatabaseConnection.getConnection();
import Moment from "moment";
import { SAVEBODEGAS } from "../../../application/services/Database/sql";

export const saveBodegas = (bodegas, db) => {
  return new Promise((resolve, reject) => {
    const insertQuery =
      SAVEBODEGAS +
      bodegas
        .map(
          (i) =>
            `('${i.codigo}', '${i.nombre}', '${Moment().format(
              "YYYY-MM-DD h:mm:ss"
            )}', '${i.usuario}')`
        )
        .join(",");
    db.transaction((tx) => {
      tx.executeSql(
        insertQuery,
        [],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const loadBodega = () => {
  return async (dispatch) => {
    try {
      const dbResult = await getBodegas(db);
      dispatch({ type: SET_BODEGA, bodegas: dbResult.rows._array });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteBodega = () => {
  return async (dispatch) => {
    try {
      const dbResult = await removeBodega(db);
      dispatch({ type: REMOVEBODEGA });
    } catch (err) {
      throw err;
    }
  };
};

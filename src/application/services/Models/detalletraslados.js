import {
  CREATETABLEDETALLETRASLADO,
  REMOVETABLEDETALLETRASLADO,
  SAVEDETALLETRASLADO,
  REMOVEDETALLETRASLADO,
  GETDETALLETRASLADO,
} from "../Database/sql";
import { execute, DatabaseConnection } from "../Database/db-service";
import Moment from "moment";

export const createTableDetalleTraslado = (db) => {
  return execute(db, CREATETABLEDETALLETRASLADO);
};
export const removeTableDetalleTraslado = (db) => {
  return execute(db, REMOVETABLEDETALLETRASLADO);
};

export const saveDetalleTraslado = (trasladoId, detalles, db) => {
  let fecha = Moment().format("YYYY-MM-DD h:mm:ss");
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      detalles.forEach((detalle) => {
        tx.executeSql(
          SAVEDETALLETRASLADO,
          [
            trasladoId,
            detalle.codigoInterno + "",
            detalle.centroCosto,
            detalle.cantidad,
            detalle.cantidadRecibida,
            fecha,
            detalle.unidad,
          ],
          (_, result) => resolve({ id: result.insertId, status: 200 }),
          (_, err) => reject({ id: 0, status: 500 })
        );
      });
    });
  });
};

export const removeDetalleTraslado = (db, id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        REMOVEDETALLETRASLADO,
        [id],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const getDetalleTraslados = (trasladoId) => {
  return new Promise((resolve, reject) => {
    DatabaseConnection.getConnection().transaction((tx) => {
      tx.executeSql(
        GETDETALLETRASLADO,
        [trasladoId],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const saveDetalleTrasladoLocal = (trasladoId, detalles, db) => {
  let fecha = Moment().format("YYYY-MM-DD h:mm:ss");

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      detalles.forEach((detalle) => {
        tx.executeSql(
          SAVEDETALLETRASLADO,
          [
            trasladoId,
            detalle.codigoInterno + "",
            detalle.centroCosto,
            detalle.cantidad,
            detalle.cantidadRecibida,
            fecha,
            detalle.unidad,
          ],
          (_, result) => resolve({ status: 200 }),
          (_, err) => reject({ status: 500 })
        );
      });
    });
  });
};

import {
  CREATETABLEUNIDADES,
  SAVEUNIDAD,
  REMOVETABLEUNIDADES,
  SAVEUNIDADES,
  REMOVEUNIDADES,
  GETUNIDADES,
} from "../Database/sql";
import { execute, DatabaseConnection } from "../Database/db-service";
import Moment from "moment";

export const createTableUnidades = (db) => {
  return execute(db, CREATETABLEUNIDADES);
};
export const removeTableUnidades = (db) => {
  return execute(db, REMOVETABLEUNIDADES);
};

export const saveUnidad = (db, nombre, codigo, fecha) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        SAVEUNIDAD,
        [nombre, codigo, fecha],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const removeUnidades = (db) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        REMOVEUNIDADES,
        [],
        (_, result) => resolve(200),
        (_, err) => reject(500)
      );
    });
  });
};

export const getUnidades = () => {
  return new Promise((resolve, reject) => {
    DatabaseConnection.getConnection().transaction((tx) => {
      tx.executeSql(
        GETUNIDADES,
        [],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const saveUnidades = (unidades, db) => {
  let fecha = Moment().format("YYYY-MM-DD h:mm:ss");
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      unidades.forEach((unidad) => {
        tx.executeSql(
          SAVEUNIDAD,
          [unidad.nombre, unidad.id, fecha],
          (_, result) => resolve(200),
          (_, err) => reject(500)
        );
      });
    });
  });
};

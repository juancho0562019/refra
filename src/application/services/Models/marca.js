import {
  CREATETABLEMARCA,
  SAVEMARCAS,
  REMOVETABLEMARCA,
  SAVEMARCA,
  REMOVEMARCA,
  GETMARCA,
} from "../Database/sql";
import { execute, DatabaseConnection } from "../Database/db-service";
import Moment from "moment";

export const createTableMarca = (db) => {
  return execute(db, CREATETABLEMARCA);
};
export const removeTableMarca = (db) => {
  return execute(db, REMOVETABLEMARCA);
};

export const saveMarca = (db, nombre, codigo, fecha) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        SAVEMARCA,
        [nombre, codigo, fecha],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const removeMarca = (db) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        REMOVEMARCA,
        [],
        (_, result) => resolve(200),
        (_, err) => reject(500)
      );
    });
  });
};

export const getMarca = () => {
  return new Promise((resolve, reject) => {
    DatabaseConnection.getConnection().transaction((tx) => {
      tx.executeSql(
        GETMARCA,
        [],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const saveMarcas = (marcas, db) => {
  let fecha = Moment().format("YYYY-MM-DD h:mm:ss");
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      marcas.forEach((marca) => {
        tx.executeSql(
          SAVEMARCA,
          [marca.nombre, marca.id, fecha],
          (_, result) => resolve(200),
          (_, err) => reject(500)
        );
      });
    });
  });
};

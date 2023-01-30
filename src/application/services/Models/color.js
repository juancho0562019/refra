import {
  CREATETABLECOLOR,
  SAVECOLOR,
  REMOVETABLECOLOR,
  SAVECOLORES,
  REMOVECOLOR,
  GETCOLOR,
} from "../Database/sql";
import { execute, DatabaseConnection } from "../Database/db-service";
import Moment from "moment";

export const createTableColor = (db) => {
  return execute(db, CREATETABLECOLOR);
};
export const removeTableColor = (db) => {
  return execute(db, REMOVETABLECOLOR);
};

export const saveColor = (db, nombre, codigo, fecha) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        SAVECOLOR,
        [nombre, codigo, fecha],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const removeColor = (db) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        REMOVECOLOR,
        [],
        (_, result) => resolve(200),
        (_, err) => reject(500)
      );
    });
  });
};

export const getColor = () => {
  return new Promise((resolve, reject) => {
    DatabaseConnection.getConnection().transaction((tx) => {
      tx.executeSql(
        GETCOLOR,
        [],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const saveColores = (colores, db) => {
  let fecha = Moment().format("YYYY-MM-DD h:mm:ss");
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      colores.forEach((color) => {
        tx.executeSql(
          SAVECOLOR,
          [color.nombre, color.id, fecha],
          (_, result) => resolve(200),
          (_, err) => reject(500)
        );
      });
    });
  });
};

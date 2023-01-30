import {
  CREATETABLECONDUCTOR,
  REMOVETABLECONDUCTOR,
  SAVECONDUCTOR,
  REMOVECONDUCTOR,
  GETCONDUCTOR,
} from "../Database/sql";
import { execute, DatabaseConnection } from "../Database/db-service";
import Moment from "moment";

export const createTableConductor = (db) => {
  return execute(db, CREATETABLECONDUCTOR);
};
export const removeTableConductor = (db) => {
  return execute(db, REMOVETABLECONDUCTOR);
};

export const saveConductor = (db, nombre, apellido, codigo, fecha) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        SAVECONDUCTOR,
        [nombre, apellido, codigo, fecha],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const removeConductor = (db) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        REMOVECONDUCTOR,
        [],
        (_, result) => resolve(200),
        (_, err) => reject(500)
      );
    });
  });
};

export const getConductores = () => {
  return new Promise((resolve, reject) => {
    DatabaseConnection.getConnection().transaction((tx) => {
      tx.executeSql(
        GETCONDUCTOR,
        [],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const saveConductores = (conductores, db) => {
  let fecha = Moment().format("YYYY-MM-DD h:mm:ss");
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      conductores.forEach((conductor) => {
        tx.executeSql(
          SAVECONDUCTOR,
          [conductor.nombres, conductor.apellidos, conductor.id, fecha],
          (_, result) => resolve(200),
          (_, err) => reject(500)
        );
      });
    });
  });
};

import {CREATETABLEBODEGA, REMOVETABLEBODEGA, SAVEBODEGA, REMOVEBODEGA, GETBODEGA} from '../Database/sql';
import { execute, DatabaseConnection } from '../Database/db-service';
import Moment from 'moment';

export const createTableBodega = (db) => {
    return execute(db, CREATETABLEBODEGA);
}
export const removeTableBodega = (db) => {
  return execute(db, REMOVETABLEBODEGA);
}

export const saveBodega = (db, nombre, codigo, fecha) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        SAVEBODEGA,
        [nombre, codigo, fecha],
        (_, result) => resolve(result),
        (_, err) => reject(err),
      );
    });
  });
};


export const removeBodega = (db) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        REMOVEBODEGA,
        [],
        (_, result) => resolve(200),
        (_, err) => reject(500),
      );
    });
  });
};

export const getBodegas = () => {
  return new Promise((resolve, reject) => {
    DatabaseConnection.getConnection().transaction((tx) => {
      tx.executeSql(
        GETBODEGA,
        [],
        (_, result) => resolve(result),
        (_, err) => reject(err),
      );
    });
  });
};

export const saveBodegas = (bodegas, db) => {
  let fecha = Moment().format('YYYY-MM-DD h:mm:ss');
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      bodegas.forEach(bodega => {
        tx.executeSql(
          SAVEBODEGA,
          [
            bodega.nombre,
            bodega.id,
            fecha
          ],
          (_, result) => resolve(200),
          (_, err) => reject(500),
        );
      });
    });
  });
};

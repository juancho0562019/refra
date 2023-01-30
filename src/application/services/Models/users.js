import {CREATETABLEUSER, REMOVETABLEUSER, SAVEUSER, REMOVEUSER, GETUSER} from '../Database/sql';
import { execute, DatabaseConnection } from '../Database/db-service';

export const createTableUser = (db) => {
    return execute(db, CREATETABLEUSER);
}
export const removeTableUser = (db) => {
  return execute(db, REMOVETABLEUSER);
}

export const saveUser = (db, username, nombres, apellidos, token, refreshToken, fecha, bodegaId, bodegaNombre) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        SAVEUSER,
        [username, nombres, apellidos, token, refreshToken, fecha, bodegaId, bodegaNombre],
        (_, result) => resolve(result),
        (_, err) => reject(err),
      );
    });
  });
};


export const removeUser = (db) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        REMOVEUSER,
        [],
        (_, result) => resolve(result),
        (_, err) => reject(err),
      );
    });
  });
};

export const getUser = () => {
  return new Promise((resolve, reject) => {
    DatabaseConnection.getConnection().transaction((tx) => {
      tx.executeSql(
        GETUSER,
        [],
        (_, result) => resolve(result),
        (_, err) => reject(err),
      );
    });
  });
};

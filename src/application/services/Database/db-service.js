import * as SQLite from "expo-sqlite";
import { DB_NAME } from "../../common/Globals";

export const DatabaseConnection = {
  getConnection: () => SQLite.openDatabase(DB_NAME),
};

export const execute = (db, preparedStatement) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        preparedStatement,
        [],
        () => resolve(),
        (_, err) => reject(err)
      );
    });
  });
};

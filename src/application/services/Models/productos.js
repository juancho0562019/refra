import {
  CREATETABLEPRODUCTO,
  REMOVETABLEPRODUCTO,
  SAVEPRODUCTO,
  REMOVEPRODUCTO,
  GETPRODUCTO,
  GETPRODUCTOID,
} from "../Database/sql";
import { execute, DatabaseConnection } from "../Database/db-service";
import Moment from "moment";
export const createTableProducto = (db) => {
  return execute(db, CREATETABLEPRODUCTO);
};
export const removeTableProducto = (db) => {
  return execute(db, REMOVETABLEPRODUCTO);
};

export const saveProducto = (
  db,
  nombre,
  codigo,
  codigoInterno,
  marca,
  serie,
  tipo,
  unidad,
  color,
  centroCosto,
  fecha
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        SAVEPRODUCTO,
        [
          nombre,
          codigo,
          codigoInterno,
          marca,
          serie,
          tipo,
          unidad,
          color,
          centroCosto,
          fecha,
        ],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const saveProductos = (productos, db) => {
  let fecha = Moment().format("YYYY-MM-DD h:mm:ss");
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      productos.forEach((producto) => {
        tx.executeSql(
          SAVEPRODUCTO,
          [
            producto.nombre,
            producto.id,
            producto.codigoInterno,
            producto.marca?.id,
            producto.serie,
            producto.tipo,
            producto.unidad?.id,
            producto.color?.id,
            producto.centroCosto?.nombre,
            fecha,
          ],
          (_, result) => resolve(200),
          (_, err) => reject(500)
        );
      });
    });
  });
};

export const removeProducto = (db) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        REMOVEPRODUCTO,
        [],
        (_, result) => resolve(200),
        (_, err) => reject(500)
      );
    });
  });
};

export const getProductos = () => {
  return new Promise((resolve, reject) => {
    DatabaseConnection.getConnection().transaction((tx) => {
      tx.executeSql(
        GETPRODUCTO,
        [],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const getProducto = (codInterno) => {
  return new Promise((resolve, reject) => {
    DatabaseConnection.getConnection().transaction((tx) => {
      tx.executeSql(
        GETPRODUCTOID,
        [codInterno],
        (_, result) => resolve(result.rows._array[0]),
        (_, err) => reject(err)
      );
    });
  });
};

export const getProductosSearch = (codigo, nombre) => {
  let conditions = `  (a.nombre LIKE '%${nombre}%') OR (a.codigoInterno LIKE '%${nombre}%')`;
  //let conditions = `'%${cedula}${nombre}%'`;
  let sql_ = ` SELECT a.nombre, a.codigo, a.codigoInterno, a.marca, a.serie, a.tipo, b.nombre nombreUnidad, b.codigo unidad, a.color, a.centroCosto, a.createdAt
  FROM productos a left join unidades b on b.codigo = a.unidad
  WHERE ${conditions} 
  LIMIT 10`;
  return new Promise((resolve, reject) => {
    DatabaseConnection.getConnection().transaction((tx) => {
      tx.executeSql(
        sql_,
        [],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

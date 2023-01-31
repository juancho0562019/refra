import {
  CREATETABLETRASLADO,
  REMOVETABLETRASLADO,
  SAVETRASLADO,
  REMOVETRASLADO,
  GETTRASLADO,
  COUNTTRASLADOS,
  GETDETALLETRASLADO,
  UPDATETRASLADO,
  UPDATETRASLADOAPI,
  GETTRASLADOCOD,
  SAVETRASLADOENTREGA,
  SAVEDETALLETRASLADO,
  UPDATETRASLADOLOCAL,
  UPDATETRASLADORECEPCION,
} from "../Database/sql";
import { execute, DatabaseConnection } from "../Database/db-service";
import Moment from "moment";

export const createTableTraslado = (db) => {
  return execute(db, CREATETABLETRASLADO);
};
export const removeTableTraslado = (db) => {
  return execute(db, REMOVETABLETRASLADO);
};

export const saveTraslado = (
  db,
  usuarioEnviaId,
  conductorId,
  fecha,
  bodegaOrigen,
  bodegaDestino,
  user
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        SAVETRASLADO,
        [
          usuarioEnviaId,
          conductorId,
          fecha,
          fecha,
          bodegaOrigen,
          bodegaDestino,
          "GENERADO",
          user,
        ],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const updateTraslado = (
  db,
  id,
  conductorId,
  fecha,
  bodegaDestino,
  user,
  placa
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        UPDATETRASLADO,
        [conductorId, fecha, bodegaDestino, placa, id, user],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const updateTrasladoAPIId = (db, id, ApiId, user) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        UPDATETRASLADOAPI,
        [ApiId, id, user],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const removeTraslado = (db, id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        REMOVETRASLADO,
        [id],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const getTraslados = () => {
  return new Promise((resolve, reject) => {
    DatabaseConnection.getConnection().transaction((tx) => {
      tx.executeSql(
        GETTRASLADO,
        [],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const getCountTrasladosDay = (db, dateOfStart, dateOfEnd, username) => {
  let Today = Moment().format("YYYY-MM-DD");
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        COUNTTRASLADOS,
        [dateOfStart, dateOfEnd, username],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const getTrasladoItem = async (db, trasladoId) => {
  try {
    const items = [];
    const results = await getTrasladoById(db, trasladoId);

    const resultsDetalle = await getDetalleTrasladoById(db, trasladoId);
    results.rows._array.forEach(function (result) {
      items.push({ detalle: resultsDetalle?.rows?._array || [], ...result });
    });
    return items.find((x) => x.id > 0);
  } catch (error) {
    console.error(error);
    throw Error("Failed to get traslados !!!");
  }
};

export const getTrasladoById = (db, trasladoId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        GETTRASLADO,
        [trasladoId],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const getTrasladoByCodInterno = (db, trasladoId, userName, estado) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        GETTRASLADOCOD,
        [trasladoId, userName, estado],
        (_, result) =>
          resolve({
            item:
              result.rows._array.length > 0
                ? result.rows._array.find((x) => x.id > 0)
                : {},
            status: 200,
          }),
        (_, err) => reject({ item: {}, status: 500 })
      );
    });
  });
};

export const getDetalleTrasladoById = (db, trasladoId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        GETDETALLETRASLADO,
        [trasladoId],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const getCountTrasladoDia = (db, nombre, apellido, fecha, username) => {
  let conditions = `  AND ((c.nombre|| c.apellido) LIKE '%${nombre}${apellido}%')`;
  //let conditions = `'%${cedula}${nombre}%'`;
  let sql_ = ` SELECT  a.conductorId, a.id, (c.nombre||' '||c.apellido) nombre, c.apellido, strftime('%Y-%m-%d', a.createdAt) fecha, codInterno idInterno,
   case when ifnull(codInterno, '') = '' THEN 0 ELSE 1 END codInterno, d.nombre nomBodegaOrigen, e.nombre nomBodegaDestino,
    count(*) articulos, sum(b.id) detalles
  FROM traslados a LEFT JOIN detalletraslados b ON a.id = b.trasladoId 
  LEFT JOIN conductores c ON c.codigo = a.conductorId 
  LEFT JOIN bodegas d ON a.bodegaOrigenId = d.codigo
  LEFT JOIN bodegas e ON a.bodegaDestinoId = e.codigo
  WHERE strftime('%Y-%m-%d', a.createdAt) = ? AND a.created = ? AND a.estado NOT IN("LOCAL")
  GROUP BY a.conductorId, a.id, c.nombre, c.apellido, strftime('%Y-%m-%d', fecha), idInterno, codInterno, d.nombre, e.nombre`;

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        sql_,
        [fecha, username],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const getCountTrasladoLocal = (db, nombre, apellido, fecha, usuario) => {
  let conditions = `  AND ((c.nombre|| c.apellido) LIKE '%${nombre}${apellido}%')`;
  //let conditions = `'%${cedula}${nombre}%'`;
  let sql_ = ` SELECT  a.created, a.conductorId, a.id, c.nombre, c.apellido, strftime('%Y-%m-%d', a.createdAt) fecha, codInterno idInterno,
   case when ifnull(codInterno, '') = '' THEN 0 ELSE 1 END codInterno, d.nombre nomBodegaOrigen, e.nombre nomBodegaDestino,
    count(*) articulos, sum(b.id) detalles
  FROM traslados a LEFT JOIN detalletraslados b ON a.id = b.trasladoId 
  LEFT JOIN conductores c ON c.codigo = a.conductorId 
  LEFT JOIN bodegas d ON a.bodegaOrigenId = d.codigo
  LEFT JOIN bodegas e ON a.bodegaDestinoId = e.codigo
  WHERE a.estado = "LOCAL" AND a.created = '${usuario}'
  GROUP BY a.created, a.conductorId, a.id, c.nombre, c.apellido, strftime('%Y-%m-%d', fecha), idInterno, codInterno, d.nombre, e.nombre`;

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        sql_,
        [],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const saveTrasladoEntrega = (
  db,
  codInterno,
  usuarioEnviaId,
  conductorId,
  fecha,
  bodegaOrigen,
  bodegaDestino,
  user,
  estadoLocal,
  placa
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        SAVETRASLADOENTREGA,
        [
          codInterno,
          usuarioEnviaId,
          conductorId,
          fecha,
          fecha,
          bodegaOrigen,
          bodegaDestino,
          estadoLocal,
          user,
          placa,
        ],
        (_, result) => resolve({ id: result.insertId, status: 200 }),
        (_, err) => reject({ id: 0, status: 500 })
      );
    });
  });
};

export const updateTrasladoLocal = (
  db,
  id,
  trasladoId,
  usuarioEnvia,
  conductorId,
  fecha,
  bodegaDestino,
  bodegaOrigen,
  user
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        UPDATETRASLADOLOCAL,
        [
          trasladoId,
          usuarioEnvia,
          conductorId,
          fecha,
          bodegaDestino,
          bodegaOrigen,
          id,
          user,
          "LOCAL",
        ],
        (_, result) => resolve({ status: 200 }),
        (_, err) => reject({ status: 500 })
      );
    });
  });
};

export const updateTrasladoRecepcion = (db, id, usuarioRecibe, fecha) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        UPDATETRASLADORECEPCION,
        [usuarioRecibe, fecha, id, usuarioRecibe, "LOCAL"],
        (_, result) => resolve({ status: 200 }),
        (_, err) => reject({ status: 500 })
      );
    });
  });
};

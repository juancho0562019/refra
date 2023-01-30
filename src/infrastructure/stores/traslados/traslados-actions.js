import {
  DatabaseConnection,
  getCountTrasladosDay,
  getCountTrasladoDia,
  saveTraslado,
  saveDetalleTraslado,
  getTrasladoItem,
  getTrasladoById,
  getTrasladoByCodInterno,
  getDetalleTrasladoById,
  updateTraslado,
  removeDetalleTraslado,
  updateTrasladoAPIId,
  getCountTrasladoLocal,
  saveTrasladoEntrega,
  saveDetalleTrasladoLocal,
  updateTrasladoLocal,
  removeTraslado,
  updateTrasladoRecepcion,
} from "../../../application/services";

import Moment from "moment";
import Traslado from "./traslado";
export const ADD_TRASLADO = "ADD_TRASLADO";
export const SET_TRASLADO = "SET_TRASLADO";
export const REMOVETRASLADO = "REMOVETRASLADO";
export const SET_COUNTTRASLADOS = "SET_COUNTTRASLADOS";
export const SET_TRASLADODIA = "SET_TRASLADODIA";
export const SET_TRASLADOLOCAL = "SET_TRASLADOLOCAL";
export const UPDATE_TRASLADO = "UPDATE_TRASLADO";
const db = DatabaseConnection.getConnection();

export const loadTrasladosCount = (dateOfStart, dateOfEnd, username) => {
  return async (dispatch) => {
    try {
      const dbResult = await getCountTrasladosDay(
        db,
        dateOfStart,
        dateOfEnd,
        username
      );
      dispatch({
        type: SET_COUNTTRASLADOS,
        countTraslados: dbResult.rows._array,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const loadTrasladoById = (trasladoId) => {
  return async (dispatch) => {
    try {
      const dbResult = await getTrasladoById(db, trasladoId);
      const dbResultDetalle = await getDetalleTrasladoById(db, trasladoId);

      dispatch({
        type: SET_TRASLADO,
        traslado: dbResult.rows._array,
        detalle: dbResultDetalle.rows._array,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const countTraslados = (nombre, apellido, fecha, username) => {
  return async (dispatch) => {
    try {
      const dbResult = await getCountTrasladoDia(
        db,
        nombre,
        apellido,
        fecha,
        username
      );

      dispatch({ type: SET_TRASLADODIA, trasladoDia: dbResult.rows._array });
    } catch (err) {
      throw err;
    }
  };
};

export const countTrasladosLocal = (nombre, apellido, fecha, usuario) => {
  return async (dispatch) => {
    try {
      const dbResult = await getCountTrasladoLocal(
        db,
        nombre,
        apellido,
        fecha,
        usuario
      );
      console.log(dbResult);
      dispatch({
        type: SET_TRASLADOLOCAL,
        trasladoLocal: dbResult.rows._array,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const countTrasladosLocalResult = (nombre, apellido, fecha) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("Count");
      getCountTrasladoLocal(db, nombre, apellido, fecha)
        .then((dbResult) => resolve({ items: dbResult.rows._array }))
        .catch((err) => {
          console.log(err);
          reject({ items: [] });
        });

      /**dispatch({
        type: SET_TRASLADOLOCAL,
        trasladoLocal: dbResult.rows._array,
      });**/
    } catch (err) {
      reject({ items: [] });
    }
  });
};

export const addTraslado = (
  id,
  usuarioEnviaId,
  conductorId,
  fecha,
  detalle,
  bodegaOrigen,
  bodegaDestino,
  user
) => {
  return async (dispatch) => {
    try {
      var newTraslado = new Traslado(
        id,
        usuarioEnviaId,
        "",
        conductorId,
        "",
        fecha,
        detalle,
        bodegaOrigen,
        bodegaDestino
      );
      dispatch({ type: ADD_TRASLADO, newTraslado: newTraslado });
    } catch (err) {
      throw err;
    }
  };
};

export const updateTrasladoAction = (
  trasladoId,
  usuarioEnviaId,
  conductorId,
  fecha,
  detalle,
  bodegaDestino,
  user
) => {
  return async (dispatch) => {
    try {
      const dbResult = await updateTraslado(
        db,
        trasladoId,
        conductorId,
        fecha,
        bodegaDestino,
        user
      );

      if (dbResult.rowsAffected > 0) {
        const dbResultDetalle = await removeDetalleTraslado(db, trasladoId);
        const dbResultDetalleSave = await saveDetalleTraslado(
          trasladoId,
          detalle,
          db
        );

        if (dbResultDetalleSave.insertId > 0) {
          var newTraslado = new Traslado(
            trasladoId,
            usuarioEnviaId,
            "",
            conductorId,
            "",
            fecha,
            detalle
          );
          dispatch({ type: ADD_TRASLADO, newTraslado: newTraslado });
        }
      }
    } catch (err) {
      throw err;
    }
  };
};

export const loadTrasladoItem = async (trasladoId) => {
  try {
    const results = await getTrasladoItem(db, trasladoId);

    return results;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get traslados !!!");
  }
};

export const updateCodInterno = async (trasladoId, codInterno, user) => {
  try {
    const results = await updateTrasladoAPIId(
      db,
      trasladoId,
      codInterno > 0 ? parseInt(codInterno) : 0,
      user
    );

    return { status: 200 };
  } catch (error) {
    return { status: 500 };
  }
};

export const getTrasladoByIdAction = (trasladoId, userName, estado) => {
  return new Promise((resolve, reject) => {
    try {
      getTrasladoByCodInterno(db, trasladoId, userName, estado).then((result) =>
        //resolve({ item: x.item, status: 200 })
        getDetalleTrasladoById(db, trasladoId).then((resultsDetalle) => {
          const item = {
            detalle: resultsDetalle?.rows?._array || [],
            item: result.item,
          };
          resolve({ ...item, status: 200 });
        })
      );
    } catch (err) {
      reject({ item: {}, status: 500 });
    }
  });
};

export const saveTrasladoEntregaLocal = async (
  codInterno,
  usuarioEnviaId,
  conductorId,
  fecha,
  detalle,
  bodegaOrigen,
  bodegaDestino,
  user,
  estadoLocal
) => {
  return new Promise((resolve, reject) => {
    saveTrasladoEntrega(
      db,
      codInterno,
      usuarioEnviaId,
      conductorId,
      fecha,
      bodegaOrigen,
      bodegaDestino,
      user,
      estadoLocal
    )
      .then((x) => {
        saveDetalleTrasladoLocal(x.id, detalle, db)
          .then((z) => resolve({ id: x, ...x }))
          .catch((err) => reject({ id: 0, ...err }));
      })
      .catch((err) => reject(err));
  });
};

export const updateTrasladoActionLocal = (
  id,
  trasladoId,
  usuarioEnviaId,
  conductorId,
  fecha,
  detalle,
  bodegaDestino,
  bodegaOrigen,
  user
) => {
  return new Promise((resolve, reject) => {
    updateTrasladoLocal(
      db,
      id,
      trasladoId,
      usuarioEnviaId,
      conductorId,
      fecha,
      bodegaDestino,
      bodegaOrigen,
      user
    )
      .then((x) => {
        removeDetalleTraslado(db, id)
          .then((z) =>
            saveDetalleTraslado(id, detalle, db)
              .then((c) => resolve({ status: 200 }))
              .catch((err) => reject(err))
          )
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

export const removeTrasladoActionLocal = (id) => {
  return new Promise((resolve, reject) => {
    removeDetalleTraslado(db, id)
      .then((x) => {
        removeTraslado(db, id)
          .then((f) => {
            console.log(id);
            resolve({ status: 200 });
          })
          .catch((err) => reject({ status: 500 }));
      })
      .catch((err) => reject({ status: 500 }));
  });
};

export const updateTrasladoRecepcionAction = (
  id,
  usuarioRecibeId,
  fecha,
  detalle
) => {
  return new Promise((resolve, reject) => {
    updateTrasladoRecepcion(db, id, usuarioRecibeId, fecha)
      .then((x) => {
        removeDetalleTraslado(db, id)
          .then((z) =>
            saveDetalleTraslado(id, detalle, db)
              .then((c) => resolve({ status: 200 }))
              .catch((err) => reject(err))
          )
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

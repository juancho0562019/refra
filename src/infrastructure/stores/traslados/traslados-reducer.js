import {
  ADD_TRASLADO,
  SET_TRASLADO,
  REMOVETRASLADO,
  SET_COUNTTRASLADOS,
  SET_TRASLADODIA,
  UPDATE_TRASLADO,
  SET_TRASLADOLOCAL,
} from "./traslados-actions";
import { getDetalleTrasladoById } from "../../../application/services";
import Moment from "moment";
import CountTraslado from "./count-traslado";
import Traslado from "./traslado";
import TrasladoDia from "./traslados-dia";
const initialState = {
  traslado: {},
  traslados: [],
  countTraslados: [],
  trasladosDia: [],
  trasladoLocal: [],
};

const trasladosReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_COUNTTRASLADOS:
      var trasladoDay = [];
      const initDay = new CountTraslado(Moment().format("YYYY-MM-DD"), 0);
      if (action.countTraslados.length > 0) {
        if (
          action.countTraslados[0].fecha === undefined ||
          action.countTraslados[0].fecha === "undefined"
        ) {
          trasladoDay.unshift(initDay);
        } else {
          let len = action.countTraslados.length;
          let fechaActual = false;
          for (let i = 0; i < len; i++) {
            let item = action.countTraslados[i];
            trasladoDay.push(
              new CountTraslado(item.fecha, item.traslados, item.state)
            );
            if (Moment().format("YYYY-MM-DD") === item.fecha)
              fechaActual = true;
          }
          if (!fechaActual) {
            trasladoDay.unshift(initDay);
          }
        }
      } else {
        trasladoDay.push(initDay);
      }

      return {
        ...state,
        countTraslados: trasladoDay,
      };
    case SET_TRASLADO:
      var traslados = [];
      action.traslado.forEach(function (pl) {
        traslados.push(
          new Traslado(
            pl.id,
            pl.usuarioEnviaId,
            pl.usuarioRecibeId,
            pl.conductorId,
            pl.fecha,
            pl.createdAt,
            action.detalle,
            pl.bodegaOrigen,
            pl.bodegaDestino
          )
        );
      });
      return {
        ...state,
        traslado: traslados.find((x) => x.id > 0),
      };
    case REMOVETRASLADO:
      return {
        ...state,
        traslados: state.traslados.filter((item) => item.id !== action.id),
      };
    case UPDATE_TRASLADO:
      var traslados = state.traslados.filter(
        (item) => item.id !== action.newTraslado.id
      );
      var newTraslado = new Traslado(
        action.newTraslado.id.toString(),
        action.newTraslado.usuarioEnviaId,
        action.newTraslado.usuarioRecibeId,
        action.newTraslado.conductorId,
        action.newTraslado.fecha,
        action.newTraslado.createdAt,
        action.newTraslado.bodegaOrigen,
        action.newTraslado.bodegaDestino
      );
      traslados.push(newTraslado);
      return {
        ...state,
        traslados: traslados,
      };

    case ADD_TRASLADO:
      var newTraslado = new Traslado(
        action.newTraslado.id.toString(),
        action.newTraslado.usuarioEnviaId,
        action.newTraslado.usuarioRecibeId,
        action.newTraslado.conductorId,
        action.newTraslado.fecha,
        action.newTraslado.createdAt,
        action.newTraslado.bodegaOrigen,
        action.newTraslado.bodegaDestino
      );

      return {
        ...state,
        traslados: [...state.traslados, newTraslado],
      };

    case SET_TRASLADODIA:
      var trasladoDia = [];

      action.trasladoDia.forEach(function (pl) {
        trasladoDia.push(
          new TrasladoDia(
            pl.id,
            pl.nombre,
            pl.apellido,
            pl.fecha,
            pl.detalles > 0 ? pl.articulos : 0,
            pl.codInterno,
            pl.idInterno,
            pl.nomBodegaOrigen,
            pl.nomBodegaDestino
          )
        );
      });
      return {
        ...state,
        trasladosDia: trasladoDia,
      };
    case SET_TRASLADOLOCAL:
      var trasladoLocal = [];

      action.trasladoLocal.forEach(function (pl) {
        trasladoLocal.push(
          new TrasladoDia(
            pl.id,
            pl.nombre,
            pl.apellido,
            pl.fecha,
            pl.detalles > 0 ? pl.articulos : 0,
            pl.codInterno,
            pl.idInterno,
            pl.nomBodegaOrigen,
            pl.nomBodegaDestino
          )
        );
      });
      return {
        ...state,
        trasladosLocal: trasladoLocal,
      };
    default:
      return state;
  }
};

export default trasladosReducer;

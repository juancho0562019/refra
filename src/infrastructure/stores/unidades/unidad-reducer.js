import { SET_UNIDAD, REMOVEUNIDADES } from "./unidad-actions";
import Moment from "moment";
import Unidad from "./unidad";
const initialState = {
  unidades: [],
};

const unidadReducer = (state = initialState, action) => {
  switch (action.type) {
    case REMOVEUNIDADES:
      return {
        ...state,
        unidades: state.unidades.filter((item) => item.nombre !== ""),
      };
    case SET_UNIDAD:
      var unidades = [];
      action.unidades.forEach(function (pl) {
        unidades.push(new Unidad(pl.id, pl.codigo, pl.nombre));
      });
      return {
        ...state,
        unidades: unidades,
      };

    default:
      return state;
  }
};

export default unidadReducer;

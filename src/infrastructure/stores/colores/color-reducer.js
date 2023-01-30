import { SET_COLOR, REMOVECOLOR } from "./color-actions";
import Color from "./color";
const initialState = {
  colores: [],
};

const colorReducer = (state = initialState, action) => {
  switch (action.type) {
    case REMOVECOLOR:
      return {
        ...state,
        colores: state.colores.filter((item) => item.nombre !== ""),
      };
    case SET_COLOR:
      var colores = [];
      action.colores.forEach(function (pl) {
        colores.push(new Color(pl.id, pl.codigo, pl.nombre));
      });
      return {
        ...state,
        colores: colores,
      };

    default:
      return state;
  }
};

export default colorReducer;

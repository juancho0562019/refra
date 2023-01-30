import { SET_MARCA, REMOVEMARCA } from "./marca-actions";
import Marca from "./marca";
const initialState = {
  marcas: [],
};

const marcaReducer = (state = initialState, action) => {
  switch (action.type) {
    case REMOVEMARCA:
      return {
        ...state,
        marcas: state.marcas.filter((item) => item.nombre !== ""),
      };
    case SET_MARCA:
      var marcas = [];
      action.marcas.forEach(function (pl) {
        marcas.push(new Marca(pl.id, pl.codigo, pl.nombre));
      });
      return {
        ...state,
        marcas: marcas,
      };

    default:
      return state;
  }
};

export default marcaReducer;

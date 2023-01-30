import { SET_PRODUCTO, REMOVEPRODUCTO } from "./producto-actions";
import Moment from "moment";
import Producto from "./producto";
const initialState = {
  productos: [],
};

const productoReducer = (state = initialState, action) => {
  switch (action.type) {
    case REMOVEPRODUCTO:
      return {
        ...state,
        productos: state.productos.filter((item) => item.nombre !== ""),
      };
    case SET_PRODUCTO:
      var productos = [];
      action.productos.forEach(function (pl) {
        productos.push(
          new Producto(
            pl.codigo,
            pl.codigoInterno,
            pl.nombre,
            pl.marca,
            pl.serie,
            pl.tipo,
            pl.unidad,
            pl.nombreUnidad,
            pl.color,
            pl.centroCosto,
            pl.createdAt
          )
        );
      });
      return {
        ...state,
        productos: productos,
      };

    default:
      return state;
  }
};

export default productoReducer;

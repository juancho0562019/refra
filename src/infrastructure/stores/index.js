import { toggleTheme, themeReducer } from "./themes";
import { loadUser, deleteUser, userReducer } from "./users";
import {
  loadTrasladosCount,
  countTraslados,
  trasladosReducer,
  addTraslado,
  saveTrasladoEntregaLocal,
  loadTrasladoById,
  loadTrasladoItem,
  updateTrasladoAction,
  updateCodInterno,
  getTrasladoByIdAction,
  countTrasladosLocal,
  updateTrasladoActionLocal,
  removeTrasladoActionLocal,
  updateTrasladoRecepcionAction,
  countTrasladosLocalResult,
} from "./traslados";
import { productoReducer, loadProducto } from "./productos";
import { bodegaReducer, loadBodega } from "./bodegas";
import { colorReducer, loadColor } from "./colores";
import { unidadReducer, loadUnidades } from "./unidades";
import { marcaReducer, loadMarca } from "./marcas";
import {
  loadConductor,
  deleteConductor,
  conductorReducer,
} from "./conductores";
export {
  toggleTheme,
  themeReducer,
  bodegaReducer,
  loadUser,
  deleteUser,
  userReducer,
  loadTrasladosCount,
  trasladosReducer,
  countTraslados,
  productoReducer,
  loadProducto,
  loadBodega,
  loadConductor,
  deleteConductor,
  conductorReducer,
  addTraslado,
  saveTrasladoEntregaLocal,
  loadTrasladoById,
  loadTrasladoItem,
  updateTrasladoAction,
  updateCodInterno,
  colorReducer,
  loadColor,
  unidadReducer,
  loadUnidades,
  marcaReducer,
  loadMarca,
  getTrasladoByIdAction,
  countTrasladosLocal,
  updateTrasladoActionLocal,
  removeTrasladoActionLocal,
  updateTrasladoRecepcionAction,
  countTrasladosLocalResult,
};

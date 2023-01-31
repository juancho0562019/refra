import {
  createTableUser,
  removeTableUser,
  saveUser,
  removeUser,
  getUser,
} from "./users";
import {
  createTableBodega,
  removeTableBodega,
  saveBodega,
  removeBodega,
  getBodegas,
  saveBodegas,
} from "./bodegas";
import {
  createTableUnidades,
  removeTableUnidades,
  removeUnidades,
  getUnidades,
  saveUnidades,
} from "./unidades";
import {
  createTableMarca,
  removeTableMarca,
  removeMarca,
  getMarca,
  saveMarca,
  saveMarcas,
} from "./marca";
import {
  createTableColor,
  removeTableColor,
  removeColor,
  getColor,
  saveColor,
  saveColores,
} from "./color";
import {
  createTableConductor,
  removeTableConductor,
  saveConductor,
  removeConductor,
  getConductores,
  saveConductores,
} from "./conductores";

import {
  createTableProducto,
  removeTableProducto,
  saveProducto,
  removeProducto,
  getProductos,
  saveProductos,
  getProductosSearch,
  getProducto,
} from "./productos";

import {
  createTableTraslado,
  removeTableTraslado,
  saveTraslado,
  saveTrasladoEntrega,
  removeTraslado,
  getTraslados,
  getCountTrasladosDay,
  getCountTrasladoDia,
  getTrasladoById,
  getDetalleTrasladoById,
  getTrasladoItem,
  updateTraslado,
  updateTrasladoAPIId,
  getTrasladoByCodInterno,
  getCountTrasladoLocal,
  updateTrasladoLocal,
  updateTrasladoRecepcion,
} from "./traslados";
import {
  createTableDetalleTraslado,
  removeTableDetalleTraslado,
  saveDetalleTraslado,
  removeDetalleTraslado,
  saveDetalleTrasladoLocal,
} from "./detalletraslados";
export {
  createTableUser,
  removeTableUser,
  saveUser,
  removeUser,
  getUser,
  createTableBodega,
  removeTableBodega,
  saveBodega,
  removeBodega,
  getBodegas,
  createTableConductor,
  removeTableConductor,
  saveConductor,
  removeConductor,
  getConductores,
  createTableProducto,
  removeTableProducto,
  saveProducto,
  removeProducto,
  getProductos,
  saveBodegas,
  saveConductores,
  saveProductos,
  createTableTraslado,
  removeTableTraslado,
  saveTraslado,
  removeTraslado,
  saveTrasladoEntrega,
  getTraslados,
  getCountTrasladosDay,
  getCountTrasladoDia,
  createTableDetalleTraslado,
  removeTableDetalleTraslado,
  getProductosSearch,
  saveDetalleTraslado,
  getTrasladoById,
  getTrasladoByCodInterno,
  getDetalleTrasladoById,
  getTrasladoItem,
  updateTraslado,
  removeDetalleTraslado,
  updateTrasladoAPIId,
  createTableUnidades,
  removeTableUnidades,
  removeUnidades,
  getUnidades,
  saveUnidades,
  createTableMarca,
  removeTableMarca,
  removeMarca,
  getMarca,
  saveMarca,
  saveMarcas,
  createTableColor,
  removeTableColor,
  removeColor,
  getColor,
  saveColor,
  saveColores,
  getCountTrasladoLocal,
  saveDetalleTrasladoLocal,
  updateTrasladoLocal,
  updateTrasladoRecepcion,
  getProducto,
};

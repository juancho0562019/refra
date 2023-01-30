import { DatabaseConnection } from "../Database/db-service";
import { removeProducto, saveProductos } from "../Models";
import { useState } from "react";
export const ProductoSyncInit = async (productos) => {
  try {
    const db = DatabaseConnection.getConnection();
    let deleteProducto = await removeProducto(db);
    if (deleteProducto != 200) {
      return 500;
    }
    if (deleteProducto == 200) {
      let saveProducto = await saveProductos(productos, db);

      return saveProducto;
    }
  } catch (error) {
    return error;
  }
};

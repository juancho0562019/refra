
import { DatabaseConnection, getProductosSearch, removeProducto } from '../../../application/services';
import { SAVEPRODUCTOS } from '../../../application/services/Database/sql';
export const SET_PRODUCTO = "SET_PRODUCTO";
export const REMOVEPRODUCTO = "REMOVEPRODUCTO";
const db = DatabaseConnection.getConnection();




export const loadProducto = (codigo, nombre) => {

 return async dispatch => {
   try {
     const dbResult = await getProductosSearch(db, codigo, nombre);
     dispatch({ type: SET_PRODUCTO, productos: dbResult.rows._array });
   } catch (err) {
     throw err;
   }
 };
};

export const deleteProducto = () => {
 return async dispatch => {
   try {
     const dbResult = await removeProducto(db);
     dispatch({ type: REMOVEPRODUCTO});
   } catch (err) {
     throw err;
   }
 };
};


import { DatabaseConnection, getConductores, removeConductor } from '../../../application/services';
export const SET_CONDUCTOR = "SET_CONDUCTOR";
export const REMOVECONDUCTOR = "REMOVECONDUCTOR";
const db = DatabaseConnection.getConnection();

export const loadConductor = () => {
 
 return async dispatch => {
   try {
     const dbResult = await getConductores(db);
     
     dispatch({ type: SET_CONDUCTOR, conductores: dbResult.rows._array });
   } catch (err) {
     throw err;
   }
 };
};

export const deleteConductor = () => {
 return async dispatch => {
   try {
     const dbResult = await removeConductor(db);
     dispatch({ type: REMOVECONDUCTOR});
   } catch (err) {
     throw err;
   }
 };
};

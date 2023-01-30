import {
  DatabaseConnection,
  getColor,
  removeColor,
} from "../../../application/services";
export const SET_COLOR = "SET_COLOR";
export const REMOVECOLOR = "REMOVECOLOR";
const db = DatabaseConnection.getConnection();

export const loadColor = () => {
  return async (dispatch) => {
    try {
      const dbResult = await getColor(db);
      dispatch({ type: SET_COLOR, colores: dbResult.rows._array });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteColor = () => {
  return async (dispatch) => {
    try {
      const dbResult = await removeColor(db);
      dispatch({ type: REMOVECOLOR });
    } catch (err) {
      throw err;
    }
  };
};

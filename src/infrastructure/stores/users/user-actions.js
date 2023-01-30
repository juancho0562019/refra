
import { DatabaseConnection, getUser, removeUser } from '../../../application/services';
 export const SET_USER = "SET_USER";
 export const REMOVEUSER = "REMOVEUSER";
 const db = DatabaseConnection.getConnection();

export const loadUser = () => {
  
  return async dispatch => {
    try {
      const dbResult = await getUser(db);
  
      dispatch({ type: SET_USER, user: dbResult.rows._array });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteUser = (username) => {
  return async dispatch => {
    try {
      const dbResult = await removeUser(db, username);
      dispatch({ type: REMOVEUSER, username: username });
    } catch (err) {
      throw err;
    }
  };
};
 
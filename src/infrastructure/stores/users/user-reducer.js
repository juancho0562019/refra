import { SET_USER,REMOVEUSER } from "./user-actions";
import Moment from 'moment';
import User from "./user";
const initialState = {
  user: {}
};

const userReducer = (state = initialState, action) => {

  switch (action.type) {
      case REMOVEUSER:
        return {
          ...state,
          user: state.user.filter(item => item.username !== action.username)
        };
      case SET_USER:
        var users = [];
          action.user.forEach(function (pl) {
            users.push( new User(
              pl.username,
              pl.nombres,
              pl.apellidos,
              pl.bodegaId,
              pl.bodegaNombre,
              pl.token,
              pl.refreshToKen,
              pl.lastAccess
            )); 
          });
        return {
          ...state, user: users.find(x=>x!==undefined)
        };
        
    default:
      return state;
  }
};

export default userReducer ;
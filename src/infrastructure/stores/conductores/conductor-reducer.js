import { SET_CONDUCTOR,REMOVECONDUCTOR } from "./conductor-actions";
import Moment from 'moment';
import Conductor from "./conductor";
const initialState = {
  conductores: []
};

const conductorReducer = (state = initialState, action) => {

  switch (action.type) {
      case REMOVECONDUCTOR:
        return {
          ...state,
          conductores: state.conductores.filter(item => item.nombres !== '')
        };
      case SET_CONDUCTOR:
        var conductores = [];
          action.conductores.forEach(function (pl) {
            conductores.push( new Conductor(
              pl.codigo,
              pl.nombre,
              pl.apellido, 
              pl.usuario
            )); 
          });
        return {
          ...state, conductores: conductores
        };
        
    default:
      return state;
  }
};

export default conductorReducer ;
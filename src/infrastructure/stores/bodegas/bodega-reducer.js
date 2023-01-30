import { SET_BODEGA,REMOVEBODEGA } from "./bodega-actions";
import Moment from 'moment';
import Bodega from "./bodega";
const initialState = {
  bodegas: []
};

const bodegaReducer = (state = initialState, action) => {

  switch (action.type) {
      case REMOVEBODEGA:
        return {
          ...state,
          bodegas: state.bodegas.filter(item => item.nombre !== '')
        };
      case SET_BODEGA:
        var bodegas = [];
          action.bodegas.forEach(function (pl) {
            bodegas.push( new Bodega(
              pl.id,
              pl.codigo,
              pl.nombre
            )); 
          });
        return {
          ...state, bodegas: bodegas
        };
        
    default:
      return state;
  }
};

export default bodegaReducer ;
import * as ActionTypes from './ActionTypes';

export const comentarios = (state = { errMess: null, comentarios: [] }, action) => {
  switch (action.type) {
    case ActionTypes.ADD_COMENTARIOS:
      return { ...state, errMess: null, comentarios: action.payload };

    case ActionTypes.COMENTARIOS_FAILED:
      return { ...state, errMess: action.payload };

    case ActionTypes.ADD_COMENTARIO: 
       action.payload[5]=state.comentarios.length;
       var comentario = {autor:action.payload[2], comentario:action.payload[3], dia:action.payload[4], excursionId:action.payload[0], id:action.payload[5], valoracion:action.payload[1]};
       state.comentarios[state.comentarios.length]=comentario;
       return { ...state, errMess: null, comentarios: state.comentarios };
       

    default:
      return state;
  }
};
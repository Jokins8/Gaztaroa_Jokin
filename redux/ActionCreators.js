import * as ActionTypes from './ActionTypes';
import { db } from '../comun/comun';

//let comentariosRef = db.ref('/comentarios');
/*comentariosRef.on('value', snapshot => {
    let data = snapshot.val();
    console.log(Object.values(data));
   
  });*/

export const fetchComentarios = () => (dispatch) => {
    return fetch(db.ref('comentarios') + '.json')
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
        .then(response => response.json())
        .then(comentarios => dispatch(addComentarios(comentarios)))
        .catch(error => dispatch(comentariosFailed(error.message)));
};

export const comentariosFailed = (errmess) => ({
    type: ActionTypes.COMENTARIOS_FAILED,
    payload: errmess
});

export const addComentarios = (comentarios) => ({
    type: ActionTypes.ADD_COMENTARIOS,
    payload: comentarios
});

export const fetchExcursiones = () => (dispatch) => {

    dispatch(excursionesLoading());

    return fetch(db.ref('excursiones') + '.json')
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
        .then(response => response.json())
        .then(excursiones => dispatch(addExcursiones(excursiones)))
        .catch(error => dispatch(excursionesFailed(error.message)));
};

export const excursionesLoading = () => ({
    type: ActionTypes.EXCURSIONES_LOADING
});

export const excursionesFailed = (errmess) => ({
    type: ActionTypes.EXCURSIONES_FAILED,
    payload: errmess
});

export const addExcursiones = (excursiones) => ({
    type: ActionTypes.ADD_EXCURSIONES,
    payload: excursiones
});

export const fetchCabeceras = () => (dispatch) => {

    dispatch(cabecerasLoading());

    return fetch(db.ref('cabeceras') + '.json')
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
        .then(response => response.json())
        .then(cabeceras => dispatch(addCabeceras(cabeceras)))
        .catch(error => dispatch(cabecerasFailed(error.message)));
};

export const cabecerasLoading = () => ({
    type: ActionTypes.CABECERAS_LOADING
});

export const cabecerasFailed = (errmess) => ({
    type: ActionTypes.CABECERAS_FAILED,
    payload: errmess
});

export const addCabeceras = (cabeceras) => ({
    type: ActionTypes.ADD_CABECERAS,
    payload: cabeceras
});

export const fetchActividades = () => (dispatch) => {

    dispatch(actividadesLoading());

    return fetch(db.ref('actividades') + '.json')
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
        .then(response => response.json())
        .then(actividades => dispatch(addActividades(actividades)))
        .catch(error => dispatch(actividadesFailed(error.message)));
};

export const actividadesLoading = () => ({
    type: ActionTypes.ACTIVIDADES_LOADING
});

export const actividadesFailed = (errmess) => ({
    type: ActionTypes.ACTIVIDADES_FAILED,
    payload: errmess
});

export const addActividades = (actividades) => ({
    type: ActionTypes.ADD_ACTIVIDADES,
    payload: actividades
});


export const postFavorito = (excursionId, user) => (dispatch) => {
    setTimeout(() => {
        dispatch(addFavorito(excursionId, user));
    }, 2000);
};

export const addFavorito = (excursionId, user) => ({
    type: ActionTypes.ADD_FAVORITO,
    payload: [excursionId, user]
});

export const borrarFavorito = (excursionId, user) => ({
    type: ActionTypes.BORRAR_FAVORITO,
    payload: [excursionId, user]
});

export const postComentario = (excursionId, valoracion, autor, comentario, id) => (dispatch) => {
    setTimeout(() => {
        var d = new Date();
        var dia = d.toISOString();
  
        db.ref('comentarios').child(id).set({
            'autor': autor, 'comentario': comentario, 'dia': dia,
            'excursionId': excursionId, 'id': id, 'valoracion': valoracion
        })
        dispatch(addComentario(excursionId, valoracion, autor, comentario, dia, id));
    }, 2000);
};

export const addComentario = (excursionId, valoracion, autor, comentario, dia, id) => ({
    type: ActionTypes.ADD_COMENTARIO,
    payload: [excursionId, valoracion, autor, comentario, dia, id]
});

export const postActualuser = (email) => (dispatch) => {
    setTimeout(() => {
        dispatch(addActualuser(email));
    }, 2000);
};

export const addActualuser = (email) => ({
    type: ActionTypes.ADD_ACTUALUSER,
    payload: email
});
import * as ActionTypes from './ActionTypes';
export const favoritos = (state = { excursion: [], user: [] }, action) => {
    switch (action.type) {
        case ActionTypes.ADD_FAVORITO:
            if (state.user.some(el => el === action.payload[1])) {
                let flag = 1;
                for (i = 0; i < state.user.length; i++) {
                    if (state.user[i] == action.payload[1]) {
                        if (state.excursion[i] == action.payload[0]) {
                            flag = 0;
                            return state;
                        }
                    }
                }
                if (flag = 1) {
                    state.user[state.user.length] = action.payload[1];
                    state.excursion[state.excursion.length] = action.payload[0];
                    return { ...state, excursion: state.excursion, user: state.user };
                }
            }
            else {
                state.user[state.user.length] = action.payload[1];
                state.excursion[state.excursion.length] = action.payload[0];
                return { ...state, excursion: state.excursion, user: state.user };
            }

        case ActionTypes.BORRAR_FAVORITO:
            console.log("Estamos aqui");
            for (i = 0; i < state.user.length; i++) {
                if (state.user[i] == action.payload[1]) {
                    if (state.excursion[i] == action.payload[0]) {
                        state.user.splice(i,1);
                        state.excursion.splice(i,1);
                        return { ...state, excursion: state.excursion, user: state.user };
                    }
                }
            }

        default:
            return state;
    }
};
import * as ActionTypes from './ActionTypes';
export const actualuser = (state= null, action) => {
    switch (action.type) {
        case ActionTypes.ADD_ACTUALUSER:
            if (state === action.payload)
                return state;
            else
                return action.payload;
        default:
            return state;
    }
};
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { excursiones } from './excursiones';
import { comentarios } from './comentarios';
import { cabeceras } from './cabeceras';
import { actividades } from './actividades';
import { favoritos } from './favoritos';
import ExpoFileSystemStorage from "redux-persist-expo-filesystem"
import { persistReducer, persistStore, persistCombineReducers } from 'redux-persist'


const persistConfig = {
    key: "root",
    whitelist: ['favoritos'],
    storage: ExpoFileSystemStorage
};


export const ConfigureStore = () => {
    const store = createStore(
        persistCombineReducers(persistConfig, { excursiones, comentarios, cabeceras, actividades, favoritos }),
        applyMiddleware(thunk, logger)
    );

    let persistor = persistStore(store)
    return { store, persistor }
}
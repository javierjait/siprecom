// redux
import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import {
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';

// Helpers
import { isTokenExpired } from '../helpers';

// Reducer
import { reducer } from './reducers';

const logger = createLogger({})

// redux toolkit
const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    })//.concat(logger),
})

// get auth token from store
const getToken = () => {
    const token = store.getState().auth?.token

    if (token !== null && isTokenExpired(token)) {
        store.dispatch({ type: 'auth/logout' });
        return undefined;
    }

    return token;
}

const persistor = persistStore(store)

export { store, persistor, getToken };
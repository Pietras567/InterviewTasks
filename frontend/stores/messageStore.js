import {configureStore} from '@reduxjs/toolkit';
import {messageAPI} from '@/services/messageAPI';

export const store = configureStore({
    reducer: {
        [messageAPI.reducerPath]: messageAPI.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(messageAPI.middleware),
});
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

// Importar reducers
import userReducer from "./slices/userSlice";
import tasksReducer from './slices/tasksSlice';
import projectsSlice from './slices/projectsSlice';

// Configuración de persistencia
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
  blacklist: ['tasks', 'projects'], // No persistir estas (se cargan del servidor)
};

// Combinar reducers
const rootReducer = combineReducers({
  auth: userReducer,
  tasks: tasksReducer,
  projects: projectsSlice,
});

// Configurar store
export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: import.meta.env.MODE !== "production",
});

// Crear persistor
export const persistor = persistStore(store);

// Tipos para TypeScript
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

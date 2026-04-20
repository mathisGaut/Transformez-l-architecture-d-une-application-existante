import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice.js';
import notesReducer from '../features/notes/notesSlice.js';
import tagsReducer from '../features/tags/tagsSlice.js';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        notes: notesReducer,
        tags: tagsReducer,
    },
});

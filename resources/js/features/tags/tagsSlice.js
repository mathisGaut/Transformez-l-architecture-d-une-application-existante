import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import api from '../../lib/api.js';

function sortTagsByName(tags) {
    return [...tags].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
}

export const fetchTags = createAsyncThunk('tags/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/tags');
        return sortTagsByName(Array.isArray(data) ? data : []);
    } catch (err) {
        return rejectWithValue(err.response?.data?.message ?? 'Impossible de charger les tags.');
    }
});

export const createTag = createAsyncThunk('tags/create', async (name, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/tags', { name: name.trim() });
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data ?? { message: 'Erreur.' });
    }
});

const tagsSlice = createSlice({
    name: 'tags',
    initialState: {
        items: [],
        listStatus: 'idle',
        listError: null,
        createStatus: 'idle',
        createError: null,
    },
    reducers: {
        clearTagCreateError(state) {
            state.createError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTags.pending, (state) => {
                state.listStatus = 'loading';
                state.listError = null;
            })
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.listStatus = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchTags.rejected, (state, action) => {
                state.listStatus = 'failed';
                state.listError = action.payload;
                state.items = [];
            })
            .addCase(createTag.pending, (state) => {
                state.createStatus = 'loading';
                state.createError = null;
            })
            .addCase(createTag.fulfilled, (state, action) => {
                state.createStatus = 'succeeded';
                state.items = sortTagsByName([...state.items, action.payload]);
            })
            .addCase(createTag.rejected, (state, action) => {
                state.createStatus = 'failed';
                state.createError = action.payload;
            });
    },
});

export const { clearTagCreateError } = tagsSlice.actions;
export default tagsSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import api from '../../lib/api.js';

export const fetchNotes = createAsyncThunk('notes/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/notes');
        return Array.isArray(data) ? data : [];
    } catch (err) {
        return rejectWithValue(err.response?.data?.message ?? 'Impossible de charger les notes.');
    }
});

export const createNote = createAsyncThunk(
    'notes/create',
    async ({ text, tag_id }, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/notes', { text, tag_id });
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data ?? { message: 'Erreur.' });
        }
    },
);

export const deleteNote = createAsyncThunk('notes/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/notes/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data ?? { message: 'Suppression impossible.' });
    }
});

const notesSlice = createSlice({
    name: 'notes',
    initialState: {
        items: [],
        listStatus: 'idle',
        listError: null,
        createStatus: 'idle',
        createError: null,
        deleteStatus: 'idle',
        deleteError: null,
    },
    reducers: {
        clearNoteErrors(state) {
            state.createError = null;
            state.deleteError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotes.pending, (state) => {
                state.listStatus = 'loading';
                state.listError = null;
            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.listStatus = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                state.listStatus = 'failed';
                state.listError = action.payload;
                state.items = [];
            })
            .addCase(createNote.pending, (state) => {
                state.createStatus = 'loading';
                state.createError = null;
            })
            .addCase(createNote.fulfilled, (state, action) => {
                state.createStatus = 'succeeded';
                state.items = [action.payload, ...state.items];
            })
            .addCase(createNote.rejected, (state, action) => {
                state.createStatus = 'failed';
                state.createError = action.payload;
            })
            .addCase(deleteNote.pending, (state) => {
                state.deleteStatus = 'loading';
                state.deleteError = null;
            })
            .addCase(deleteNote.fulfilled, (state, action) => {
                state.deleteStatus = 'succeeded';
                state.items = state.items.filter((n) => n.id !== action.payload);
            })
            .addCase(deleteNote.rejected, (state, action) => {
                state.deleteStatus = 'failed';
                state.deleteError = action.payload;
            });
    },
});

export const { clearNoteErrors } = notesSlice.actions;
export default notesSlice.reducer;

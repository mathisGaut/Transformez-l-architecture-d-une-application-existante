import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import api, { AUTH_TOKEN_KEY } from '../../lib/api.js';

export const initializeAuth = createAsyncThunk(
    'auth/initialize',
    async () => {
        if (!localStorage.getItem(AUTH_TOKEN_KEY)) {
            return { user: null };
        }
        try {
            const { data } = await api.get('/user');
            return { user: data };
        } catch {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            return { user: null };
        }
    },
    {
        condition: (_, { getState }) => getState().auth.initialized === false,
    },
);

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/login', {
            email,
            password,
            device_name: 'react-spa',
        });
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        return data.user;
    } catch (err) {
        return rejectWithValue(err.response?.data ?? { message: 'Connexion impossible.' });
    }
});

export const logout = createAsyncThunk('auth/logout', async () => {
    try {
        await api.post('/logout');
    } catch {
        // token peut déjà être invalide
    } finally {
        localStorage.removeItem(AUTH_TOKEN_KEY);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        initialized: false,
        loginStatus: 'idle',
        loginError: null,
        logoutStatus: 'idle',
    },
    reducers: {
        clearLoginError(state) {
            state.loginError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initializeAuth.pending, (state) => {
                state.initialized = false;
            })
            .addCase(initializeAuth.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.initialized = true;
            })
            .addCase(initializeAuth.rejected, (state) => {
                state.user = null;
                state.initialized = true;
            })
            .addCase(login.pending, (state) => {
                state.loginStatus = 'loading';
                state.loginError = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loginStatus = 'succeeded';
                state.user = action.payload;
                state.loginError = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loginStatus = 'failed';
                state.loginError = action.payload;
            })
            .addCase(logout.pending, (state) => {
                state.logoutStatus = 'loading';
            })
            .addCase(logout.fulfilled, (state) => {
                state.logoutStatus = 'idle';
                state.user = null;
            })
            .addCase(logout.rejected, (state) => {
                state.logoutStatus = 'idle';
                state.user = null;
            });
    },
});

export const { clearLoginError } = authSlice.actions;
export default authSlice.reducer;

import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { clearLoginError, login } from '../features/auth/authSlice.js';
import { formatValidationMessage } from '../lib/formatApiError.js';
import { useAppDispatch, useAppSelector } from '../store/hooks.js';

function loginErrorMessage(payload) {
    if (!payload) {
        return '';
    }
    if (payload.errors?.email?.[0]) {
        return payload.errors.email[0];
    }
    return formatValidationMessage(payload);
}

export default function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector((s) => s.auth.user);
    const loginStatus = useAppSelector((s) => s.auth.loginStatus);
    const loginError = useAppSelector((s) => s.auth.loginError);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (user) {
        return <Navigate to="/notes" replace />;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        dispatch(clearLoginError());

        try {
            await dispatch(login({ email, password })).unwrap();
            navigate('/notes', { replace: true });
        } catch {
            // erreur déjà dans le store
        }
    }

    const loading = loginStatus === 'loading';
    const errorText = loginErrorMessage(loginError);

    return (
        <div className="flex min-h-screen flex-col justify-center px-4">
            <div className="mx-auto w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h1 className="text-center text-lg font-semibold text-zinc-900 dark:text-zinc-50">Connexion API</h1>
                <p className="mt-1 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Utilise les mêmes identifiants que sur la version Livewire.
                </p>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            E-mail
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="username"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                        />
                    </div>

                    {errorText ? (
                        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300" role="alert">
                            {errorText}
                        </p>
                    ) : null}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                    >
                        {loading ? 'Connexion…' : 'Se connecter'}
                    </button>
                </form>
            </div>
        </div>
    );
}

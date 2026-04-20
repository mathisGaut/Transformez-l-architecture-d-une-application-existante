import { useEffect } from 'react';

import { initializeAuth } from './features/auth/authSlice.js';
import { useAppDispatch, useAppSelector } from './store/hooks.js';

export default function AppSessionGate({ children }) {
    const dispatch = useAppDispatch();
    const initialized = useAppSelector((s) => s.auth.initialized);

    useEffect(() => {
        dispatch(initializeAuth());
    }, [dispatch]);

    if (!initialized) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Chargement de la session…</p>
            </div>
        );
    }

    return children;
}

import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { logout } from '../features/auth/authSlice.js';
import { useAppDispatch } from '../store/hooks.js';

const linkClass = ({ isActive }) =>
    [
        'rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
            ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100',
    ].join(' ');

export default function AppShell() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    async function handleLogout() {
        await dispatch(logout());
        navigate('/login', { replace: true });
    }

    return (
        <div className="min-h-screen">
            <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Renote (React)</span>
                    <nav className="flex items-center gap-1">
                        <NavLink to="/notes" className={linkClass} end>
                            Notes
                        </NavLink>
                        <NavLink to="/tags" className={linkClass} end>
                            Tags
                        </NavLink>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="ml-2 rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-900"
                        >
                            Déconnexion
                        </button>
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-4xl px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
}

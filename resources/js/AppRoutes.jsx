import { Navigate, Route, Routes } from 'react-router-dom';

import AppShell from './layouts/AppShell.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotesPage from './pages/NotesPage.jsx';
import TagsPage from './pages/TagsPage.jsx';
import { AUTH_TOKEN_KEY } from './lib/api.js';

function RootRedirect() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    return <Navigate to={token ? '/notes' : '/login'} replace />;
}

function ProtectedLayout() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <AppShell />;
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedLayout />}>
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/tags" element={<TagsPage />} />
            </Route>
        </Routes>
    );
}

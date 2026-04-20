import { Navigate, Route, Routes } from 'react-router-dom';

import AppShell from './layouts/AppShell.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotesPage from './pages/NotesPage.jsx';
import TagsPage from './pages/TagsPage.jsx';
import { useAppSelector } from './store/hooks.js';

function RootRedirect() {
    const user = useAppSelector((s) => s.auth.user);

    return <Navigate to={user ? '/notes' : '/login'} replace />;
}

function ProtectedLayout() {
    const user = useAppSelector((s) => s.auth.user);

    if (!user) {
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

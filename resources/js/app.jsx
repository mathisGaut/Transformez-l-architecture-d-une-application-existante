import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import AppRoutes from './AppRoutes.jsx';

const root = document.getElementById('spa-root');

if (root) {
    createRoot(root).render(
        <StrictMode>
            <BrowserRouter basename="/app">
                <AppRoutes />
            </BrowserRouter>
        </StrictMode>,
    );
}

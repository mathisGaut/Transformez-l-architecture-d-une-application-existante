import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import AppSessionGate from './AppSessionGate.jsx';
import AppRoutes from './AppRoutes.jsx';
import { store } from './store/store.js';

const root = document.getElementById('spa-root');

if (root) {
    createRoot(root).render(
        <StrictMode>
            <Provider store={store}>
                <BrowserRouter basename="/app">
                    <AppSessionGate>
                        <AppRoutes />
                    </AppSessionGate>
                </BrowserRouter>
            </Provider>
        </StrictMode>,
    );
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// ВАЖЛИВО: Перевірте, що імпортується index.scss
import './index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
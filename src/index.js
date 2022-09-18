import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
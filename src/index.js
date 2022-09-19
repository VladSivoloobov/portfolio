import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { Scene } from './Components/Pages/AboutPage/Novel/Scene';
import { ErrorPage } from './Components/Pages/ErrorPage/ErrorPage';

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        { !Scene.brokenPage ? <App /> : <ErrorPage /> } 
    </React.StrictMode>
);
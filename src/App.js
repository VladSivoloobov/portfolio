import React, {useEffect} from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import { MainPage } from "./Components/Pages/MainPage/MainPage.jsx";
import "./App.css";
import { AboutPage } from "./Components/Pages/AboutPage/AboutPage.jsx";


export function App(){
    useEffect(() => window.scroll(0, 0));
    return(
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />    
                <Route path="/about" element={<AboutPage />} />        
            </Routes>
        </Router>
    )
}
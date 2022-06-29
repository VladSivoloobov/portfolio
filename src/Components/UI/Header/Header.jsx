import React from "react";
import "./Header.css";
import "./Header_mobile.css";
import {
    Link
} from "react-router-dom";

const Path = ({linkText, path, active}) => {
    return(
        <li className={active === linkText ? "active" : "not-active"}>
            <Link to={path}>
                {linkText}
            </Link>
        </li>
    )
}

export function Header({active}){
    return(
        <header>
            <div className="logo">
                <Link to={"/"}>
                    Портфолио
                </Link>
            </div>
            <ul className="links">
                <Path linkText="Главная" path="/" active={active}/>
                <Path linkText="Обо мне" path="about" active={active}/>
                <Path linkText="Связь" path="socialMedia" active={active}/>
            </ul>
        </header>
    )
}
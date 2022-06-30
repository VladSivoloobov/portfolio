import React from "react";
import "./Header.css";
import "./Header_mobile.css";

const Path = ({linkText, active}) => {
    return(
        <li className={active === linkText ? "active" : "not-active"}>
            <a href="#">{linkText}</a>
        </li>
    )
}

export function Header({active}){
    return(
        <header>
            <div className="logo">
                <a href="#">Портфолио</a>
            </div>
            <ul className="links">
                <Path linkText="Главная" path="/" active={active}/>
                <Path linkText="Обо мне" path="about" active={active}/>
                <Path linkText="Связь" path="socialMedia" active={active}/>
            </ul>
        </header>
    )
}
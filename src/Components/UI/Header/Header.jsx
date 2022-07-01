import React from "react";
import "./Header.css";
import "./Header_mobile.css";

const Path = ({linkText, active, onclick}) => {
    return(
        <li className={active === linkText ? "active" : "not-active"}>
            {/* <a onClick={onclick} href="#">{linkText}</a> */}
            <button onClick={onclick}>{linkText}</button>
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
                <Path onclick={() => setTimeout(() => window.scrollTo({
                    top: 1,
                    behavior: "smooth"
                }), 2)} linkText="Главная" active={active}/>
                <Path onclick={() => setTimeout(() => window.scrollTo({
                    top: 700,
                    behavior: "smooth"
                }), 2)} linkText="Обо мне" active={active}/>
                <Path linkText="Связь" path="socialMedia" active={active}/>
            </ul>
        </header>
    )
}
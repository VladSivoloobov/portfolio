import React from "react";
import "./Header.css";
import "./Header_mobile.css";
import hamburger from "../../../icons/hamburger.png";
import { useState } from "react";
import { SettingsPage } from "../../Pages/SettingsPage/SettingsPage";

const Path = ({linkText, active, onclick, className, notHideOnClick}) => {
    return(
        <li className={active === linkText ? className + " active" : className + " not-active"}>
            {/* <a onClick={onclick} href="#">{linkText}</a> */}
            <button onClick={(e) => {
                onclick();
                if(!notHideOnClick)
                    e.target.parentNode.parentNode.parentNode.parentNode.classList.toggle("hamburger-active");
            }}>{linkText}</button>
        </li>
    )
}

export function Header({active, qualityMax, setQualityMax, annaChange}){
    const [settingsClicked, setSettingsClicked] = useState(false);

    function settingsClickedHandler(value){
        setSettingsClicked(value);
    }

    return(
        <header data-settings={settingsClicked}>
            <div className="logo">
                <a href="#">{annaChange ? "Свобода" : "Портфолио"}</a>
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
                {/* <Path linkText="Связь" path="socialMedia" active={active}/> */}
            </ul>
            <div className="hamburger" onClick={e => {
                e.target.classList.toggle("rotated");
                e.target.parentNode.classList.toggle("hamburger-active");
            }}>
            </div>
            <div className="hamburger-menu">
                <ul className="hamburger-links">
                <Path onclick={() => setTimeout(() => window.scrollTo({
                    top: 1,
                    behavior: "smooth"
                }), 2)} linkText="Главная" active={active}/>
                <Path onclick={() => setTimeout(() => window.scrollTo({
                    top: 700,
                    behavior: "smooth"
                }), 2)} linkText="Обо мне" active={active}/>
                {/* <Path linkText="Связь" path="socialMedia" active={active}/> */}
                <Path notHideOnClick={true} onclick={() => {
                    setSettingsClicked(!settingsClicked);
                }} className="settings" linkText="Параметры" path="socialMedia" active={active}/>
                </ul>
                {settingsClicked ? <SettingsPage setSettingsClicked={settingsClickedHandler} qualityMax={qualityMax} setQualityMax={setQualityMax} /> : <div></div>}
            </div>
        </header>
    )
}
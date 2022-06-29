import React, {
    useState,
    useEffect,
} from "react";
import { Header } from "../../UI/Header/Header";
import "./MainPage.css";
import arrow from "../../../img/ui/next.png";
import { AboutPage } from "../AboutPage/AboutPage";
import "./MainPage_mobile.css";

export function MainPage(){
    const [currentScroll, setCurrentScroll] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0)
        window.addEventListener("scroll", () => {
            setCurrentScroll(window.scrollY);       
        });
    }, []);

    const [headerLinkActive, setHeaderLinkActive] = useState("Главная");

    const nameScrollStyles = {
        transform: `translateX(${Math.floor(-currentScroll)}px)`,
        transition: 'all 0.2s ease-out',
        zIndex: "10"
    }

    const buttonScrollStyles = {
        transform: `translate(${Math.floor(currentScroll)}px)`,
        position: "relative",
        transition: "all 0.2s ease-out",
        zIndex: "10"
    }

    const contentBackgroundStyles = {
        background: `rgba(0,0,0,${
            currentScroll > 100 ? 
            (+`0.${currentScroll}` + 0.5) : "0.5"
        })`,
        transition: "background 0.1s ease-out"
    }

    const arrowScrollStyles = {
        bottom: `${Math.floor(currentScroll * 1.5)}px`,
        transition: "all 0.1s ease-out",
        zIndex: "3"
    }

    return(
        <div className="mainPage">
            <div style={contentBackgroundStyles} className="content">
                <Header active={headerLinkActive}/>
                <div className="portfolio_block">
                    <h1 style={nameScrollStyles} className="name">
                        Владислав Сиволобов
                    </h1>
                    <div style={buttonScrollStyles} className="button">
                        <button>
                            Смотреть
                        </button>
                    </div>
                    <div style={arrowScrollStyles} className="arrow">
                        <img src={arrow} alt="" />
                    </div>
                </div>
                <AboutPage changeHeaderLink={setHeaderLinkActive} />
            </div>
        </div>
    )
}
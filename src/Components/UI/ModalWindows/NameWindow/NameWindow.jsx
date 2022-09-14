import React, {useRef} from "react";
import { useState } from "react";
import "./NameWindow.css";
import "./NameWindowMobile.css";
import heart from "./../../../../img/heart.png";
import { useEffect } from "react";
import { changeTheme } from "../../../../global";

export const NameWindow = ({player, handleModalWindowFinished, handleModalWindowStarted}) => {
    handleModalWindowFinished(false);
    handleModalWindowStarted(true);

    const nameInput = useRef(null);
    const genderInput = useRef(null);
    const nameWindow = useRef(null);
    const [nameText, setNameText] = useState("");
    const [genderValue, setGenderValue] = useState("Расскажи");
    const maxNameLength = 10;
    useEffect(() => setGenderValue(genderInput.current.options[genderInput.current.selectedIndex].text));
    useEffect(() => changeTheme("#000"), []);
    return (
        <div ref={nameWindow} className="NameWindow">
            {
                nameWindow.current?.classList.contains("sos") ? 
                <div className="liza">
                    <div className="pop">💩</div>
                    <div className="pop">Лиза🤢</div>
                    <div className="pop">💩</div>
                    <div className="pop">Лиза🤢</div>
                    <div className="pop">💩</div>
                    <div className="pop">Лиза🤢</div>
                    <div className="pop">💩</div>
                    <div className="pop">Лиза🤢</div>
                    <div className="pop">💩</div>
                    <div className="pop">Лиза🤢</div>
                </div> : 
                <div className="liza standard">
                    <div className="pop">{genderValue}</div>
                    <div className="pop">{nameText}</div>
                    <div className="pop">{genderValue}</div>
                    <div className="pop">{nameText}</div>
                    <div className="pop">{genderValue}</div>
                    <div className="pop">{nameText}</div>
                    <div className="pop">{genderValue}</div>
                    <div className="pop">{nameText}</div>
                    <div className="pop">{genderValue}</div>
                    <div className="pop">{nameText}</div>
                </div>
            }
            <div className="NameWindow-container">
                <h2 className="NameWindow-title">Расскажи о себе<span className="comma">{nameText ? `,` : ""}</span>{nameText ? <br /> : ""} 
                    <span className="name">{nameText}</span>
                </h2>
                <div className="NameWindow-nameInput">
                    <label htmlFor="name">Твоё имя: </label>
                    <input ref={nameInput} onClick={(e) => {
                        e.target.classList.remove("missed")
                    }} onChange={(e) => {
                        let text = e.target.value;
                        if(text){
                            text = text.toLowerCase().split("");
                            text[0] = text[0].toUpperCase();
                            text = text.join("");
                            e.target.value = text;
                        }
                        setNameText(text);
                        if(text.toLowerCase().includes("лиза")){
                            setNameText(text + "💩🤢");
                            setTimeout(() => {
                                nameWindow.current.classList.add("sos");
                            }, 100)
                        }
                        if(text.includes(" ")){
                            e.target.value = text.replace(" ", "");
                        }
                        if(text[text.length - 1] === "а" || text[text.length - 1] === "я"){
                            genderInput.current.selectedIndex = 1;
                        }
                        else{
                            genderInput.current.selectedIndex = 0;
                        }
                        if(text.length > maxNameLength){
                            e.target.value = text.substring(0, maxNameLength);
                        }
                    }} autoComplete="off" id="name" type="value"/>
                </div>
                <div className="NameWindow-genderInput">
                    <label htmlFor="gender">Твой пол: </label>
                    <select ref={genderInput} id="gender">
                        <option>Парень</option>
                        <option>Девушка</option>
                    </select>
                </div>
                <div className="sendButtons">
                    <button>Не скажу</button>
                    <button onClick={() => {
                        player.name = nameInput.current.value;
                        player.gender = genderInput.current.value;
                        if(player.name){
                            nameWindow.current.classList.add("finished");
                            handleModalWindowFinished(true);
                            handleModalWindowStarted(false);
                            localStorage.setItem("player", JSON.stringify(player));
                        }
                        else{
                            nameInput.current.classList.add("missed");
                        }
                    }}>Готово</button>
                </div>
            </div>
        </div>
    )
}
import React, {useState, useEffect} from "react";
import "./AboutPage.css";
import smile from "../../../img/anna/tile000.png";
import happy from "../../../img/anna/tile001.png";
import baffled from "../../../img/anna/tile002.png";
import closedEyes from "../../../img/anna/tile003.png";
import scornful from "../../../img/anna/tile004.png";
import dreamed from "../../../img/anna/tile005.png";
import tired from "../../../img/anna/tile006.png";
import phrases from "./phrases.json";
import { useInView } from "react-intersection-observer";
import "./AnnaEmotions.css";
import ost from "../../../sound/ost.mp3";
import voice from "../../../sound/voice.mp3";

const audio = new Audio(ost);
const annaVoice = new Audio(voice);

export function AboutPage({styles, changeHeaderLink}){
    const AnnaEmotions = {
        smile,
        happy,
        baffled,
        closedEyes,
        scornful,
        dreamed,
        tired
    }
    //message data
    const [messageText, setMessageText] = useState(0);
    const [messageAutor, setMessageAutor] = useState(0);
    const [messageEmotion, setMessageEmotion] = useState(AnnaEmotions.smile);
    const [currentEmotion, setCurrentEmotion] = useState("smile");
    const [slowedMessageText, setSlowedMessageText] = useState("");
    // *********************************************************
    const [messageStyle, setMessageStyle] = useState({
        cursor: "default",
    });
    const [messageCompleted, setMessageCompleted] = useState(false);
    const [messageCounter, setMessageCounter] = useState(0);
    const [firstMessageNotRunned, setFirstMessageNotRunnded] = useState(true);

    const [inViewOptions, setInViewOptions] = useState({
        threshold: 0.5
    });

    const {ref, inView} = useInView(inViewOptions);
    const [windowed, setWindowed] = useState(false);
    const [aboutPageStyles, setAboutPageStyles] = useState(styles);

    const [audioButtonState, setAudioButtonState] = useState(false);

    function parseNovelTags(text){
        const startTimeout = text.indexOf("[timeout");
        const parsedTegTimeout = text.substring(
            text.indexOf("timeout") - 1,
            text.indexOf("]") + 1
        );
        

        let timeout = parsedTegTimeout.replace(
            "[timeout=",
            ""
        );

        timeout = +timeout.replace("]", "");
        const novellaText = text.replace(parsedTegTimeout, "");
        
        if(!timeout){
            return {
                novellaText: text
            }
        }

        const leftText = novellaText.substring(
            0,
            startTimeout
        );

        const rightText = novellaText.substring(
            startTimeout,
            novellaText.length - 1
        );

        return {
            startTimeout,
            timeout,
            parsedTegTimeout,
            novellaText,
            leftText,
            rightText
        };
    }

    function showMessage(text, autor = "Девочка", emotion = smile){
        const parsedText = parseNovelTags(text);
        let runnableText = parsedText.novellaText;

        if(parsedText.timeout){
            runnableText = parsedText.leftText;
        }

        setMessageEmotion(emotion);
        setFirstMessageNotRunnded(false);
        setMessageAutor(autor);
        let ms = 20;
        new Promise(async resolve => {
            setMessageCompleted(false);
            setMessageStyle({
                cursor: "default"
            })
            let buffer = "";
            for(let i = 0; i < runnableText.length; i++){
                if(parsedText.timeout){
                    if(i === parsedText.startTimeout){
                        ms = parsedText.timeout;
                    }
                }
                const letter = runnableText[i];
                buffer += letter;
                setMessageText(buffer);
                if(audioButtonState && !(letter === " " || letter === "." ||
                    letter === "!" || letter === "," || letter === "?")){
                        new Audio(voice).play()
                    }
                await timeOut(ms);
            }
            if(parsedText.timeout){
                const rightText = parsedText.rightText;
            }
            resolve(1);
        })
        .then(() => {
           setMessageStyle({
            cursor: "pointer"
           });
           setMessageCompleted(true);
        });
    }

    async function timeOut(ms){
        return new Promise(resolve => setTimeout(() => resolve(1), ms));
    }

    function nextMessage(){
        const messages = phrases;
        setCurrentEmotion(messages[messageCounter].emotion);

        let currentEmotion = AnnaEmotions[`${messages[messageCounter].emotion}`] ? 
                                AnnaEmotions[`${messages[messageCounter].emotion}`] :
                                AnnaEmotions.smile;
        const currentMessageText = messages[messageCounter].messageText;
        const currentMessageAutor = messages[messageCounter].messageAutor;

        setMessageCounter(messageCounter + 1);
        showMessage(currentMessageText, currentMessageAutor, currentEmotion);
    }    

    function playSound(){
        audio.play();
        setAudioButtonState(true);
    }

    function stopSound(){
        audio.pause();
        setAudioButtonState(false);
    }

    if(inView){
        if(firstMessageNotRunned){
            showMessage("Здравствуйте, вы искали Влада? Его здесь нету, но я знаю очень многое о нём. Могу рассказать...");
            setInViewOptions({
                threshold: 0.5
            });
        }
        if(!windowed){
            setAboutPageStyles({
                position: "fixed",
                transition: "transform 0.2s ease-out",
                transform: "translateY(0)"
            });
            setWindowed(true);
        }        
    }

    useEffect(() => {
        if(windowed){
            changeHeaderLink("Обо мне");
        }
    })

    return(
        <div ref={ref} className="aboutPage" onTransitionEnd={() => {
            window.addEventListener("scroll", (e) => {
                if(window.scrollY < 300){
                    setInViewOptions({
                        threshold: 1
                    });
                    setAboutPageStyles({
                        position: "fixed",
                        transition: "all 0.5s ease-out",
                        transform: `translateY(120%)`
                    });
                    e.target.addEventListener("transitionend", () => {
                        setWindowed(false)
                        setInViewOptions({
                            threshold: 0.5
                        });
                    })
                }
            })
        }} style={ windowed ? aboutPageStyles : styles }>
            <div className="novel">
                <div className={audioButtonState ? "audio off" : "audio"} 
                    onClick={audioButtonState ? stopSound : playSound}
                ></div>
                <div className="girl" data-windowed={ windowed ? "window" : "not-window"} data-emotion={currentEmotion}>
                    <img src={messageEmotion} alt="" onLoad={(e) => {
                        if(e.target.classList.contains("end"))
                            e.target.classList.replace("end", "start");
                        else
                            e.target.classList.add("start");
                        e.target.addEventListener("transitionend", () => {
                            e.target.classList.replace("start", "end");
                        });
                    }}/>
                </div>
                <div 
                    className={messageCompleted ? "message-block completed" : "message-block"}
                    onClick={messageCompleted ? nextMessage : null}
                    data-windowed={ windowed ? "window" : "not-window"}
                    >
                    <div className="message-name">
                        {messageAutor}
                    </div>
                    <div style={messageStyle} className="message-text">
                        {messageText}
                    </div>
                </div>
            </div>
        </div>
    )
}
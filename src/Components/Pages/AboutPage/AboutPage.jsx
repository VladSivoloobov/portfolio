import React, {useState, useEffect} from "react";
import "./AboutPage.css";
import phrases from "./phrases.json";
import { useInView } from "react-intersection-observer";
import "./AnnaEmotions.css";
import { Anna } from "./Novel/Anna";
import { Scene } from "./Novel/Scene";
import { Choice } from "./Choice";

const anna = new Anna();
const scene = new Scene();


export function AboutPage({changeHeaderLink}){
    const styles = {
        transition: "all 0.1s ease-out",
        position: "absolute",
        transform: `translateY(calc(100% - ${window.scrollY}px))`
    }

    //message data
    const [messageText, setMessageText] = useState(0);
    const [messageAutor, setMessageAutor] = useState(0);
    const [messageEmotion, setMessageEmotion] = useState(anna.emotions.smile);
    const [currentEmotion, setCurrentEmotion] = useState("smile");
    const [slowedMessageText, setSlowedMessageText] = useState("");
    const [choices, setChoices] = useState(null);
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
            novellaText.length
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

    async function runText(text, state, timeout){
        let buffer = "";
        for(let i = 0; i < text.length; i++){
            const letter = text[i];
            buffer += letter;
            state(buffer);
            if(audioButtonState && letter !== " "){
                new Audio(anna.voice).play()
            }
            await timeOut(timeout);
        }
    }

    function showMessage(text, autor = "Девочка", emotion = anna.emotions.smile, timeout = 20){
        setSlowedMessageText("");
        const parsedText = parseNovelTags(text);
        let runnableText = parsedText.timeout ? parsedText.leftText : parsedText.novellaText;
        let ms = timeout;

        setMessageEmotion(emotion);
        setFirstMessageNotRunnded(false);
        setMessageAutor(autor);
        
        new Promise(async resolve => {
            setMessageCompleted(false);
            setMessageStyle({
                cursor: "default"
            });

            await runText(runnableText, setMessageText, ms);
            if(parsedText.timeout){
                const rightText = parsedText.rightText;
                await runText(rightText, setSlowedMessageText, parsedText.timeout ? parsedText.timeout : ms);
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

        let currentEmotion = anna.emotions[`${messages[messageCounter].emotion}`] ? 
                                anna.emotions[`${messages[messageCounter].emotion}`] :
                                anna.emotions.smile;
        const currentMessageText = messages[messageCounter].messageText;
        const currentMessageAutor = messages[messageCounter].messageAutor;

        setMessageCounter(messageCounter + 1);
        showMessage(currentMessageText, currentMessageAutor, currentEmotion, messages[messageCounter].timeout);
    }    

    function playSound(){
        scene.currentMusic.play();
        setAudioButtonState(true);
    }

    function stopSound(){
        scene.currentMusic.pause();
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

        if(window.scrollY < 300){
            changeHeaderLink("Главная");
            setAudioButtonState(false);
            scene.currentMusic.pause();
        }
    }, [windowed, changeHeaderLink])

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
                        {messageText} <span className={slowedMessageText.length > 0 ? "slowed-message-text" : "span"}>{slowedMessageText}</span>
                        {choices ? <Choice choices={choices} /> : <div></div>}
                    </div>
                </div>
            </div>
        </div>
    )
}
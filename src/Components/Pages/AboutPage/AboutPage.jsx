import React, {useState, useEffect} from "react";
import "./AboutPage.css";
import { useInView } from "react-intersection-observer";
import "./AnnaEmotions.css";
import { Anna } from "./Novel/Anna";
import { Scene } from "./Novel/Scene";
import { Message } from "./Message/Message";
import "./AboutPage_mobile.css";
import { NameWindow } from "../../UI/ModalWindows/NameWindow/NameWindow";
import { Player } from "./Novel/Player";

const scene = new Scene();
const anna = new Anna();
const player = new Player();
console.log(player)

let modalWindowFinished = false;
let modalWindowStarted = false;
let nextMessage;

export function AboutPage({changeHeaderLink, scrolled, hideMainPage, setHideMainPage, qualityMax}){
    const styles = {
        transform: `translateY(calc(100% - ${window.scrollY}px))`,
    }

    const [windowed, setWindowed] = useState(false);
    const [messageEmotion, setMessageEmotion] = useState(anna.emotions.smile);
    useEffect(() => setHideMainPage(windowed));
    const [currentEmotion, setCurrentEmotion] = useState("smile");

    const [inViewOptions, setInViewOptions] = useState({
        threshold: 0.5
    });

    const {ref, inView} = useInView(inViewOptions);
    const [aboutPageStyles, setAboutPageStyles] = useState(styles);
    const [audioButtonState, setAudioButtonState] = useState(false);

    const [messageReaction, setMessageReaction] = useState(null);
    const [dialogParams, setDialogParams] = useState(null);
    
    const handleDialogParams = value => setDialogParams(value);

    const handleModalWindowFinished = value => modalWindowFinished = value;
    const handleModalWindowStarted = value => modalWindowStarted = value;
    const handleNextMessage = value => nextMessage = value;
    
    function playSound(){          
        scene.currentMusic.play();
        scene.currentMusic.loop = true;
        scene.musicPlayed = true;
        scene.ambience.volume = 0.8;
        scene.ambience.play();
        scene.ambience.loop = true;
        setAudioButtonState(true);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden){
                scene.currentMusic.pause();
                scene.musicPlayed = false;
                scene.ambience.pause();
                setAudioButtonState(false);
            }
        })
    }

    function stopSound(){
        scene.currentMusic.pause();
        scene.ambience.pause();
        scene.musicPlayed = false;
        setAudioButtonState(false);
    }

    if(inView){
        if(!windowed){
            setAboutPageStyles({
                position: "fixed",
                transition: "transform 0.4s ease-out",
                transform: "translateY(0)",
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
            scene.ambience.pause();
        }
    }, [windowed, changeHeaderLink])

    return(
        <div ref={ref} data-scrolled={ scrolled ? "scrolled" : "not-scrolled"} className="aboutPage" onTransitionEnd={() => {
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
            <div data-maxqulity={qualityMax} style={{
                backgroundSize: "cover",
                transition: "all 1s ease-out"
            }} className="novel">
                {
                    (() => {
                        switch(dialogParams){
                            case "nameModalWindow":
                                return <NameWindow player={player} 
                                            handleModalWindowFinished={handleModalWindowFinished} 
                                            handleModalWindowStarted={handleModalWindowStarted} 
                                        />;
                            //Возможно в будущем что-то ещё будет
                        }
                    })()
                }
                <div style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    position: "absolute",
                }} className="shadow"></div>
                <div className={audioButtonState ? "audio off" : "audio"} 
                    onClick={audioButtonState ? stopSound : playSound}
                ></div>
                <div data-reaction={messageReaction} className="girl" data-windowed={ windowed ? "window" : "not-window"} data-emotion={currentEmotion}>
                    <img src={currentEmotion !== "none" ? messageEmotion : anna.emotions.dreamed} alt="" onLoad={(e) => {
                        e.target.classList.toggle("start");
                    }}/>
                </div>
                <Message 
                    anna={anna}
                    windowed={windowed} 
                    setMessageEmotion={setMessageEmotion}
                    setAudioButtonState={setAudioButtonState}
                    setCurrentEmotion={setCurrentEmotion}
                    audioButtonState={audioButtonState}
                    setInViewOptions={setInViewOptions}
                    scene={scene}
                    musicPlayed={scene.musicPlayed}
                    setMessageReaction={setMessageReaction}
                    handleDialogParams={handleDialogParams}
                    player={player}
                    modalWindowFinished={modalWindowFinished}
                    modalWindowStarted={modalWindowStarted}
                />
            </div>
        </div>
    )
}
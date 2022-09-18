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
import "./NovelParamsEffects.css";

const scene = new Scene();
const anna = localStorage.getItem("anna") ? JSON.parse(localStorage.getItem("anna")) : new Anna();

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
    const [animationStopped, setAnimationStopped] = useState(false);
    const [singleEmotion, setSingleEmotion] = useState(null);

    const handleDialogParams = value => setDialogParams(value);
    const handleModalWindowFinished = value => modalWindowFinished = value;
    const handleModalWindowStarted = value => modalWindowStarted = value;
    const handleNextMessage = value => nextMessage = value;

    const [transformVoicerClasses, setTransformVoicerClasses] = useState("");
    const handleVoicerClasses = (value) => setTransformVoicerClasses(value);
    
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
            <div data-annaclose={Scene.background === Scene.backgrounds.annaCloseBackground} data-maxqulity={qualityMax} style={{
                backgroundImage: `url(${Scene.background})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: Scene.background === Scene.backgrounds.annaCloseBackground ? "contain" : "cover",
            }} className="novel">
                {
                    (() => {
                        switch(dialogParams){
                            case "nameModalWindow":
                                return <NameWindow
                                            handleModalWindowFinished={handleModalWindowFinished} 
                                            handleModalWindowStarted={handleModalWindowStarted} 
                                            nextMessage={nextMessage}
                                        />;
                            //Возможно в будущем что-то ещё будет
                        }
                    })()
                }
                <div className="shadow"></div>
                <div className={audioButtonState ? "audio off" : "audio"} 
                    onClick={audioButtonState ? stopSound : playSound}
                ></div>
                <div data-reaction={messageReaction} className="girl" data-windowed={ windowed ? "window" : "not-window"} data-emotion={currentEmotion}>
                    {
                        (() => {
                            if(!animationStopped)   
                                return <img dataset-classes={transformVoicerClasses} src={messageEmotion} alt="" onLoad={(e) => {
                                    e.target.classList.toggle("start");
                                }}/>
                            else 
                               return <img data-emotion={singleEmotion} className="singleEmotion" src={singleEmotion} />
                        })()
                    }
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
                    modalWindowFinished={modalWindowFinished}
                    modalWindowStarted={modalWindowStarted}
                    setTransformVoicerClasses={handleVoicerClasses}
                    setAnimationStopped={setAnimationStopped}
                    setSingleEmotion={setSingleEmotion}
                    handleNextMessage={handleNextMessage}
                />
            </div>
        </div>
    )
}
import React, {useState, useEffect} from "react";
import "./AboutPage.css";
import { useInView } from "react-intersection-observer";
import "./AnnaEmotions.css";
import { Anna } from "./Novel/Anna";
import { Scene } from "./Novel/Scene";
import { Choice } from "./Choice";
import { Message } from "./Message";

const scene = new Scene();
const anna = new Anna();

export function AboutPage({changeHeaderLink}){
    const styles = {
        transition: "all 0.1s ease-out",
        position: "absolute",
        transform: `translateY(calc(100% - ${window.scrollY}px))`
    }

    //message data
    const [messageEmotion, setMessageEmotion] = useState(anna.emotions.smile);
    const [currentEmotion, setCurrentEmotion] = useState("smile");
    const [firstMessageNotRunned, setFirstMessageNotRunnded] = useState(true);
    // *********************************************************

    const [inViewOptions, setInViewOptions] = useState({
        threshold: 0.5
    });

    const {ref, inView} = useInView(inViewOptions);
    const [windowed, setWindowed] = useState(false);
    const [aboutPageStyles, setAboutPageStyles] = useState(styles);

    const [audioButtonState, setAudioButtonState] = useState(false);

    function playSound(){
        scene.currentMusic.play();
        setAudioButtonState(true);
    }

    function stopSound(){
        scene.currentMusic.pause();
        setAudioButtonState(false);
    }

    if(inView){
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
                <Message 
                    anna={anna}
                    windowed={windowed} 
                    setMessageEmotion={setMessageEmotion}
                    setCurrentEmotion={setCurrentEmotion}
                    audioButtonState={audioButtonState}
                    firstMessageNotRunned={firstMessageNotRunned}
                    setFirstMessageNotRunnded={setFirstMessageNotRunnded}
                    setInViewOptions={setInViewOptions}
                />
            </div>
        </div>
    )
}
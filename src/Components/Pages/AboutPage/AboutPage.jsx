import React, {useState, useEffect} from "react";
import "./AboutPage.css";
import { useInView } from "react-intersection-observer";
import "./AnnaEmotions.css";
import { Anna } from "./Novel/Anna";
import { Scene } from "./Novel/Scene";
import { Message } from "./Message/Message";
import "./AboutPage_mobile.css";

const scene = new Scene();
const anna = new Anna();

export function AboutPage({changeHeaderLink, scrolled}){
    const styles = {
        transform: `translateY(calc(100% - ${window.scrollY}px))`,
    }

    //message data
    const [messageEmotion, setMessageEmotion] = useState(anna.emotions.smile);
    const [currentEmotion, setCurrentEmotion] = useState("smile");
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
        scene.currentMusic.loop = true;
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
            <div style={{
                backgroundImage: `url(${scene.background})`,
                backgroundSize: "cover",
                transition: "all 1s ease-out"
            }} className="novel">
                <div style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    position: "absolute",
                }} className="shadow"></div>
                <div className={audioButtonState ? "audio off" : "audio"} 
                    onClick={audioButtonState ? stopSound : playSound}
                ></div>
                <div className="girl" data-windowed={ windowed ? "window" : "not-window"} data-emotion={currentEmotion}>
                    <img src={currentEmotion !== "none" ? messageEmotion : anna.emotions.dreamed} alt="" onLoad={(e) => {
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
                    setAudioButtonState={setAudioButtonState}
                    setCurrentEmotion={setCurrentEmotion}
                    audioButtonState={audioButtonState}
                    setInViewOptions={setInViewOptions}
                    scene={scene}
                />
            </div>
        </div>
    )
}
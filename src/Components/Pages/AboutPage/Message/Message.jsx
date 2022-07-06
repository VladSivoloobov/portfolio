import React, {useState, useEffect} from "react";
import { Choice } from "../Choice/Choice";
import phrases from "../phrases.json";
import "./Message.css";
import "./Message_mobile.css";

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

let messageSkipped = false;
let messageCounter = 0;
let choiceLineCounter = 0;
let firstMessageNotRunned = true;
let musicPlayed = false;

export function Message({
        anna,
        windowed,
        setMessageEmotion,
        setCurrentEmotion,
        audioButtonState,
        setInViewOptions,
        scene,
        setAudioButtonState,
    }){
    const [messageText, setMessageText] = useState(0);
    const [messageAutor, setMessageAutor] = useState(0);
    const [slowedMessageText, setSlowedMessageText] = useState("");
    const [choices, setChoices] = useState(null);
    const [messageCompleted, setMessageCompleted] = useState(false);

    useEffect(() => {
        if(audioButtonState)
            musicPlayed = true;
        else
            musicPlayed = false;
    });

    useEffect(() => {
        if(firstMessageNotRunned && windowed){
            showMessage("Привет, меня зовут Анна. Я в данный момент заменяю Влада. Если ты хочешь, могу рассказать о нём", "Анна", "smile", 30);
            setInViewOptions({
                threshold: 0.5
            });
        }
    }, [firstMessageNotRunned, windowed])

    async function runText(text, setState, timeout){
        let buffer = "";
        const talkingAnimation = anna.animations.talking;
        for(let i = 0, animationIterator = 0; i < text.length; i++, animationIterator++){
            if(animationIterator > talkingAnimation.length - 1){
                animationIterator = 0;
            }

            let newTimeout = timeout;
            if(messageSkipped){
                setState(text)
                return;
            }
            const letter = text[i];
            buffer += letter;
            setState(buffer);
            if(musicPlayed && 
                (letter !== " " || letter !== "," || letter !== "!" || letter !== "?" || letter !== "." )
            ){
                new Audio(anna.voice).play();
            }

            switch(letter){
                case ",":
                    newTimeout *= 10;
                    break;
                case ".":
                    newTimeout *= 20;
                    break;
                case "?":
                    newTimeout *= 19;
                    break;
                default:
                    break;
            }

            if(letter === "," || letter === "." || letter === "?"){
                const annaIdleAnimation = anna.animations.idle;
                const randomIter = getRandomArbitrary(0, annaIdleAnimation.length);
                setMessageEmotion(annaIdleAnimation[randomIter]);
            }
            else{
                setMessageEmotion(talkingAnimation[animationIterator]);
                
            }
            await timeOut(newTimeout);
        }
    }

    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    async function skipMessage(){
        messageSkipped = true;
    }

    function showMessage(text, autor = "Анна", emotion = anna.emotions.smile, timeout = 20){
        setSlowedMessageText("");
        const parsedText = parseNovelTags(text);
        let runnableText = parsedText.timeout ? parsedText.leftText : parsedText.novellaText;
        let ms = timeout;

        setMessageEmotion(emotion);
        firstMessageNotRunned = false;
        setMessageAutor(autor);
        
        new Promise(async resolve => {
            setMessageCompleted(false);
            await runText(runnableText, setMessageText, ms);
            if(parsedText.timeout){
                const rightText = parsedText.rightText;
                runText(rightText, setSlowedMessageText, parsedText.timeout ? parsedText.timeout : ms);
            }
            resolve(1);
        })
        .then(() => {
           setMessageCompleted(true);
           messageSkipped = false;
        });
    }

    const [choiceLineState, setChoiceLineState] = useState(null);

    function nextMessage(choiceLine){
        if(audioButtonState)
            scene.currentMusic.play();

        let messages = choiceLine ? choiceLine : phrases;
        let messageIterator = choiceLine ? choiceLineCounter : messageCounter;
        if(choiceLine && choiceLineCounter > choiceLine?.length - 1){
            choiceLineCounter = 0;
            messages = phrases;
            messageIterator = messageCounter;
            setChoiceLineState(null);
            choiceLine = null;
        }

        const stopMusic = messages[messageIterator]?.stopMusic;
        const runMusic = messages[messageIterator]?.runMusic;

        if(stopMusic)
            scene.currentMusic.pause();
        
        if(runMusic)
            setAudioButtonState(true);

        setCurrentEmotion(messages[messageIterator].emotion);

        let currentEmotion = anna.emotions[`${messages[messageIterator].emotion}`] ? 
                                anna.emotions[`${messages[messageIterator].emotion}`] :
                                anna.emotions.smile;
        let currentMessageText = messages[messageIterator].messageText;
        const currentMessageAutor = messages[messageIterator].messageAutor;
        const currentChoices = messages[messageIterator].choices;
        const background = messages[messageIterator]?.background;
        const currentVoice = messages[messageIterator]?.voice;
        
        if(currentVoice){
            switch(currentVoice){
                case "angry":
                    anna.changeVoice({
                        angry: true,
                    });
                    break;
                case "standard":
                    anna.changeVoice({
                        standard: true,
                    })
                    break;
                default:
                    break;
            }
        }
        else{
            anna.changeVoice({
                standard: true,
            });
        }
            

        if(messages[messageIterator]?.currentDate){
            const hours = new Date().getHours();
            const minutes = new Date().getMinutes();
            const ms = new Date().getMilliseconds();
            currentMessageText += ` в ${convertWord(hours, {hours: true})}, ${convertWord(minutes, {minutes: true})}, ${convertWord(ms, {ms: true})}, ${hours > 21 || hours < 5 ? "это очень поздно!" : ""}`;
        }


        if(background){
            scene.changeBackground(background);
        }

        if(choiceLine){
            choiceLineCounter++;
        }
        else{
            messageCounter++;
        }
        showMessage(currentMessageText, currentMessageAutor, currentEmotion, messages[messageIterator].timeout);
        if(currentChoices){
            setChoices(currentChoices);
        }
    }    

    function convertWord(date, dateType){
        const lastNumber = +date.toString()[date.toString().length - 1]

        function strings(first, second, third){
            if(lastNumber === 1)
                return `${date} ${first}`;
            else if(lastNumber === 2 || lastNumber === 3)
                return `${date} ${second}`;
            else if(lastNumber >= 5 || lastNumber === 0)
                return `${date} ${third}`;
        }

        if(dateType?.hours)
            return strings("час", "часа", "часов");
        else if(dateType?.minutes)
            return strings("минута", "минуты", "минут")
        else if(dateType?.ms)
            return strings("миллисекунда", "миллисекунды", "миллисекунд");
    }

    async function timeOut(ms){
        return new Promise(resolve => setTimeout(() => resolve(1), ms));
    }

    return (
        <div 
            className={(() => {
                // messageCompleted && !choices ? "message-block completed" : "message-block"
                if(messageCompleted && !choices)
                    return "message-block completed"
                else if(!messageCompleted && !choices)
                    return "message-block not-completed"
                else 
                    return "message-block"
            })()}
            data-choiced={choices ? "choices-true" : "choices-false"}
            onClick={(() => {
                if(messageCompleted && !choices)
                    return () => nextMessage(choiceLineState)
                else if(!messageCompleted)
                    return skipMessage
                else 
                    return null
            })()}
            data-windowed={ windowed ? "window" : "not-window"}
            >
            <div className="message-name">
                {messageAutor}
            </div>
            <div className="message-text">
                {messageText} <span className={slowedMessageText.length > 0 ? "slowed-message-text" : "span"}>{slowedMessageText}</span>
                {choices && messageCompleted ? <Choice nextMessage={nextMessage}
                                setChoiceLineState={setChoiceLineState}
                                anna={anna} choices={choices}
                                setChoices={setChoices} /> : <div></div>}
            </div>
        </div>
    )
}
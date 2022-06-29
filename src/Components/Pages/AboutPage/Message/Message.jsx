import React, {useState, useEffect} from "react";
import { Choice } from "../Choice/Choice";
import phrases from "../phrases.json";
import "./Message.css";
import "./Message_mobile.css";

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

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

export function Message({
        anna,
        windowed,
        setMessageEmotion,
        setCurrentEmotion,
        audioButtonState,
        setInViewOptions,
        scene
    }){
    const [messageText, setMessageText] = useState(0);
    const [messageAutor, setMessageAutor] = useState(0);
    const [slowedMessageText, setSlowedMessageText] = useState("");
    const [messageCompleted, setMessageCompleted] = useState(false);
    const [firstMessageNotRunned, setFirstMessageNotRunnded] = useState(true);
    const [choiceLineCounter, setChoiceLineCounter] = useState(0);

    useEffect(() => {
        if(firstMessageNotRunned && windowed){
            showMessage("Здравствуйте, вы искали Влада? Его здесь нету, но я знаю очень многое о нём. Могу рассказать...");
            setInViewOptions({
                threshold: 0.5
            });
        }
    }, [firstMessageNotRunned, windowed])

    const [messageCounter, setMessageCounter] = useState(0);

    const [choices, setChoices] = useState(null);
    
    async function runText(text, setState, timeout){
        let buffer = "";
        for(let i = 0; i < text.length; i++){
            const letter = text[i];
            buffer += letter;
            setState(buffer);
            if(audioButtonState && letter !== " "){
                new Audio(anna.voice).play();
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
            await runText(runnableText, setMessageText, ms);
            if(parsedText.timeout){
                const rightText = parsedText.rightText;
                await runText(rightText, setSlowedMessageText, parsedText.timeout ? parsedText.timeout : ms, resolve);
            }
            resolve(1);
        })
        .then(() => {
           setMessageCompleted(true);
        });
    }

    const [choiceLineState, setChoiceLineState] = useState(null);

    function nextMessage(choiceLine){
        if(audioButtonState)
            scene.currentMusic.play();

        let messages = choiceLine ? choiceLine : phrases;
        let messageIterator = choiceLine ? choiceLineCounter : messageCounter;
        if(choiceLine && choiceLineCounter > choiceLine?.length - 1){
            setChoiceLineCounter(0);
            messages = phrases;
            messageIterator = messageCounter;
            setChoiceLineState(null);
            choiceLine = null;
        }

        const stopMusic = messages[messageIterator]?.stopMusic;
        if(stopMusic)
            scene.currentMusic.pause();

        setCurrentEmotion(messages[messageIterator].emotion);

        let currentEmotion = anna.emotions[`${messages[messageIterator].emotion}`] ? 
                                anna.emotions[`${messages[messageIterator].emotion}`] :
                                anna.emotions.smile;
        const currentMessageText = messages[messageIterator].messageText;
        const currentMessageAutor = messages[messageIterator].messageAutor;
        const currentChoices = messages[messageIterator].choices;

        if(choiceLine){
            setChoiceLineCounter(choiceLineCounter + 1);
        }
        else{
            setMessageCounter(messageCounter + 1);
        }
        showMessage(currentMessageText, currentMessageAutor, currentEmotion, messages[messageIterator].timeout);
        if(currentChoices){
            setChoices(currentChoices);
        }
    }    

    async function timeOut(ms){
        return new Promise(resolve => setTimeout(() => resolve(1), ms));
    }

    return (
        <div 
            className={messageCompleted && !choices ? "message-block completed" : "message-block"}
            data-choiced={choices ? "choices-true" : "choices-false"}
            onClick={messageCompleted && !choices ? function(){nextMessage(choiceLineState)} : null}
            data-windowed={ windowed ? "window" : "not-window"}
            >
            <div className="message-name">
                {messageAutor}
            </div>
            <div className="message-text">
                {messageText} <span className={slowedMessageText.length > 0 ? "slowed-message-text" : "span"}>{slowedMessageText}</span>
                {choices ? <Choice nextMessage={nextMessage} setChoiceLineState={setChoiceLineState} setMessageCounter={setMessageCounter} messageCounter={messageCounter} anna={anna} choices={choices} setChoices={setChoices} /> : <div></div>}
            </div>
        </div>
    )
}
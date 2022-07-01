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

export function Message({
        anna,
        windowed,
        setMessageEmotion,
        setCurrentEmotion,
        audioButtonState,
        setInViewOptions,
        scene,
        setAudioButtonState
    }){
    const [messageText, setMessageText] = useState(0);
    const [messageAutor, setMessageAutor] = useState(0);
    const [slowedMessageText, setSlowedMessageText] = useState("");
    const [choices, setChoices] = useState(null);
    const [messageCompleted, setMessageCompleted] = useState(false);

    useEffect(() => {
        if(firstMessageNotRunned && windowed){
            showMessage("Привет, меня зовут Анна. Я в данный момент заменяю Влада. Если ты хочешь, могу рассказать о нём");
            setInViewOptions({
                threshold: 0.5
            });
        }
    }, [firstMessageNotRunned, windowed])
    
    async function runText(text, setState, timeout){
        let buffer = "";
        for(let i = 0; i < text.length; i++){
            if(messageSkipped){
                setState(text)
                return;
            }
            const letter = text[i];
            buffer += letter;
            setState(buffer);
            if(audioButtonState && letter !== " "){
                new Audio(anna.voice).play();
            }
            await timeOut(timeout);
        }
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
        const currentMessageText = messages[messageIterator].messageText;
        const currentMessageAutor = messages[messageIterator].messageAutor;
        const currentChoices = messages[messageIterator].choices;
        const background = messages[messageIterator]?.background;

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
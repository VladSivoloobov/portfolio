import React, {useState, useEffect} from "react";
import { Choice } from "./Choice";
import { Anna } from "./Novel/Anna";
import phrases from "./phrases.json";

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
        firstMessageNotRunned,
        setFirstMessageNotRunnded,
        setInViewOptions
    }){
    const [messageText, setMessageText] = useState(0);
    const [messageAutor, setMessageAutor] = useState(0);
    const [slowedMessageText, setSlowedMessageText] = useState("");
    const [messageCompleted, setMessageCompleted] = useState(false);
    const [messageStyle, setMessageStyle] = useState({
        cursor: "default",
    });

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

    async function timeOut(ms){
        return new Promise(resolve => setTimeout(() => resolve(1), ms));
    }

    return (
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
    )
}
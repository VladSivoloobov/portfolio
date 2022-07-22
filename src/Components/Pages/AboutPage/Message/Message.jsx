import React, {useState, useEffect} from "react";
import "./Message.css";
import "./Message_mobile.css";
import { dialogs } from "../Novel/dialogs.js";
import { getRandomArbitrary, convertWord } from "../../../../global.js";
import { MessageText } from "./MessageText";
import {Howler, Howl} from "howler";

let messageSkipped = false;
let messageCounter = 0;
let firstMessageNotRunned = true;
let musicPlayed = false;
let choiceLineCounter = 0;
let fullMessageText = "";

const windowHeight = window.innerHeight;

export function Message({
        anna,
        windowed,
        setMessageEmotion,
        audioButtonState,
        setInViewOptions,
        setAudioButtonState,
        scene
    }){

    const [messageText, setMessageText] = useState("");
    const [messageAutor, setMessageAutor] = useState(0);
    const [choices, setChoices] = useState(null);
    const [messageCompleted, setMessageCompleted] = useState(false);
    const [variants, setVariants] = useState(null);
    const messages = dialogs(scene, anna);

    useEffect(() => {
        if(audioButtonState)
            musicPlayed = true;
        else
            musicPlayed = false;
    });

    useEffect(() => {
        if(firstMessageNotRunned && windowed){
            
            showMessage(messages[0].messageText, messages[0].autor, messages[0].emotion, messages[0].timeout)
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
                !(letter === " " || letter === "," || letter === "!" || letter === "?" || letter === "." )
            ){
                const sound = new Howl({
                    src: [anna.voice],
                });
                sound.play();
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

    useEffect(() => {
        if(scene.musicPlayed)
            setAudioButtonState(true);
        else
            setAudioButtonState(false);
    }, [scene, setAudioButtonState])

    function showMessage(text, autor = "Анна", emotion = anna.emotions.smile, timeout = 20){ 
        fullMessageText = text;
        console.log(fullMessageText)       
        let ms = timeout;
        setMessageEmotion(emotion);
        firstMessageNotRunned = false;
        setMessageAutor(autor);
        
        new Promise(async resolve => {
            setMessageCompleted(false);
            await runText(text, setMessageText, ms);
            resolve(1);
        })
        .then(() => {
           setMessageCompleted(true);
           messageSkipped = false;
        });
    }
  

    function nextMessage(choiceLine){
        setChoices(null);
        let currentDialog;

        if(choiceLine && choiceLineCounter < choiceLine.variantDialogs.length){
            currentDialog = choiceLine.variantDialogs[choiceLineCounter++];
        }
        else
        {
            setVariants(null);
            currentDialog = messages[++messageCounter];
            choiceLineCounter = 0;
        }

        if(currentDialog.runMusic) 
        {
            scene.currentMusic.play();
            scene.currentMusic.loop = true;
            scene.ambience.play();
            scene.ambience.loop = true;
            setAudioButtonState(true);
        }

        if(currentDialog?.callbackOutside){
            currentDialog.callbackOutside();
        }

        showMessage(
            currentDialog.messageText, currentDialog?.autor,
            currentDialog?.emotion, currentDialog?.timeout
        );
        
        const choice = currentDialog?.choice;

        if(choice){
            setChoices(choice);
        }
    } 

    async function timeOut(ms){
        return new Promise(resolve => setTimeout(() => resolve(1), ms));
    }

    return (
        <div
            className={(() => {
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
                    return () => nextMessage(variants);
                else if(!messageCompleted)
                    return () => messageSkipped = true;
                else 
                    return null
            })()}
            data-windowed={ windowed ? "window" : "not-window"}
            >
            <div className="message-name">
                {messageAutor}
            </div>
            <MessageText 
                messageText={messageText}
                choices={choices}
                anna={anna}
                variants={variants}
                setVariants={setVariants}
                nextMessage={nextMessage}
                messageCompleted={messageCompleted}
                fullMessageText={fullMessageText}
            />
        </div>
    )
}
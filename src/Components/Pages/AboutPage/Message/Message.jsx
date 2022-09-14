import React, {useState, useEffect} from "react";
import "./Message.css";
import "./Message_mobile.css";
import { dialogs } from "../Novel/dialogs.js";
import { getRandomArbitrary, convertWord, changeTheme } from "../../../../global.js";
import { MessageText } from "./MessageText";
import {Howler, Howl} from "howler";
import "./TextEffects.css";
import "./DialogTypes.css";
import "./MessageReactions.css";

let messageSkipped = false;
let messageCounter = 0;
let firstMessageNotRunned = true;
let musicPlayed = false;
let choiceLineCounter = 0;
let fullMessageText = "";
let currentDialogType;
let textEffectsComponents = [];
let messageCompleted = false;
let stopClick = false;

export function Message({
        anna,
        windowed,
        setMessageEmotion,
        audioButtonState,
        setInViewOptions,
        setAudioButtonState,
        scene,
        setMessageReaction,
        handleDialogParams,
        player,
        modalWindowFinished,
        modalWindowStarted
    }){
    
    const [messageText, setMessageText] = useState("");
    const [messageAutor, setMessageAutor] = useState(0);
    const [choices, setChoices] = useState(null);
    
    const [variants, setVariants] = useState(null);
    const messages = dialogs(scene, player, anna);   

    useEffect(() => {
        let idleEmotionIterator =  0;
        setMessageEmotion(anna.animations.idle[idleEmotionIterator++]);
        let timer = 5000;
        const interval = setInterval(() => {
            if(idleEmotionIterator > anna.animations.idle.length - 1)
                idleEmotionIterator = 0; 
           
            if(messageCompleted)
                setMessageEmotion(anna.animations.idle[idleEmotionIterator++]);
        }, timer)
        if(!messageCompleted)
            clearInterval(interval);
    }, [messageCompleted])    

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

    async function runText(text, setState, timeout, soundOff = false){
        if(!text.length){
            setState("");
        }
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
            if(musicPlayed && !soundOff && 
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

    function showMessage(text, autor = "Анна", emotion = anna.emotions.smile, timeout = 20, soundOff = false){ 
        fullMessageText = text;    
        let ms = timeout;
        setMessageEmotion(emotion);
        firstMessageNotRunned = false;
        setMessageAutor(autor);
        
        new Promise(async resolve => {
            messageCompleted = false;
            await runText(text, setMessageText, ms, soundOff);
            resolve(1);
        })
        .then(() => {
           messageCompleted = true;
           messageSkipped = false;
        });
    }

    useEffect(() => {
        if(modalWindowFinished && !modalWindowStarted){
            nextMessage();
            stopClick = false;
        }
    }, [nextMessage, stopClick])

    function waitMessage(callback){
        const interval = setInterval(() => {
            if(messageCompleted)
                setTimeout(() => {
                    callback();
                    clearInterval(interval);
                }, 500);
        }, 10);
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
        if(currentDialog?.params){
            stopClick = true;
            waitMessage(() => {
                
                handleDialogParams(currentDialog.params);
            })
        }

        if(currentDialog.runMusic) 
        {
            scene.currentMusic.play();
            scene.currentMusic.loop = true;
            scene.ambience.play();
            scene.ambience.loop = true;
            setAudioButtonState(true);
        }

        if(currentDialog?.reaction){
            setMessageReaction(currentDialog.reaction);
        }

        if(currentDialog?.callbackOutside){
            currentDialog.callbackOutside();
        }

        showMessage(
            currentDialog.messageText, currentDialog?.autor,
            currentDialog?.emotion, currentDialog?.timeout, currentDialog?.soundOff
        );
        
        const choice = currentDialog?.choice;

        if(choice){
            setChoices(choice);
        }

        currentDialogType = currentDialog.type;

        changeTheme(currentDialog.theme);

        if(currentDialog?.textEffects){
            createTextEffect(currentDialog.textEffects);
        }
        else{
            textEffectsComponents = [];
        }
    }

    function createTextEffect(textEffects){
      
        for(const textEffect of textEffects){
            textEffectsComponents.push(
                <div className={textEffect.class} key={Math.random()}>{textEffect.text}</div>
            )
        }
    }

    async function timeOut(ms){
        return new Promise(resolve => setTimeout(() => resolve(1), ms));
    }

    return (
        <div
            data-dialogtype={currentDialogType}
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
                if(messageCompleted && !choices && !stopClick)
                    return () => nextMessage(variants);
                else if(!messageCompleted || stopClick)
                    return () => messageSkipped = true;
                else 
                    return null
            })()}
            data-windowed={ windowed ? "window" : "not-window"}
            >
            <div className="message-name" data-dialogtype={currentDialogType}>
                {messageAutor}
            </div>
            <div className="text-effects" data-aftercompleted={messageCompleted}>
                {
                    textEffectsComponents.map(component => component)
                }
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
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
import { Scene } from "../Novel/Scene";
import { Player } from "../Novel/Player";

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
let idleAnimationStarted;
let skipMessageWhileComplete = false;
let functionAfterMessage;

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
        modalWindowFinished,
        modalWindowStarted,
        setTransformVoicerClasses,
        setAnimationStopped,
        setSingleEmotion,
        handleNextMessage,
        setAnnaChange,
        setGameOver,
        aboutPageRef
    }){
    
    const [messageText, setMessageText] = useState("");
    const [messageAutor, setMessageAutor] = useState(0);
    const [choices, setChoices] = useState(null);
    
    const [variants, setVariants] = useState(null);
    const messages = dialogs(scene, anna, {
        messageCompleted,
        setAnnaChange,
        setGameOver,
        aboutPageRef
    }, nextMessage);   
    
    // useEffect(() => {
    //     const savedMessageCounter = localStorage.getItem("messageCounter");
    //     if(savedMessageCounter){
    //         showMessage(Player.name !== "unknown" ? `Привет, ${Player.name}, давай продолжим там где остановились?` : "Давай продолжим там где остановились?", "Анна", anna.emotions.smile, 0);
    //         messageCounter = +savedMessageCounter;
    //     }
    // }, [])

    useEffect(() => {
        if(idleAnimationStarted)
            return;
        idleAnimationStarted = true;
        let idleEmotionIterator =  0;
        setMessageEmotion(anna.animations.idle[idleEmotionIterator++]);
        let timer = 200;
        const interval = setInterval(() => {  
            if(idleEmotionIterator > anna.animations.idle.length - 1)
                idleEmotionIterator = 0; 
           
            if(messageCompleted)
                setMessageEmotion(anna.animations.idle[idleEmotionIterator++]);
        }, timer)
        if(!messageCompleted){
            clearInterval(interval); 
            idleAnimationStarted = false;
        }     
    }, [messageCompleted]);    

    useEffect(() => {
        if(audioButtonState)
            musicPlayed = true;
        else
            musicPlayed = false;
    });

    handleNextMessage(nextMessage);

    useEffect(() => {
        localStorage.setItem("anna", JSON.stringify(anna));
    })

    useEffect(() => {
        if(firstMessageNotRunned && windowed){
            
            showMessage(messages[0].messageText, messages[0].autor, messages[0].emotion, messages[0].timeout)
            setInViewOptions({
                threshold: 0.5
            });
        }
    }, [firstMessageNotRunned, windowed])

    async function runText(text, setState, timeout, soundOff = false, animationOff = false){
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
                    src: [Scene.voice],
                });
                sound.play();
            }

            switch(letter){
                case ",":
                    newTimeout = 300;
                    break;
                case ".":
                    newTimeout = 400;
                    break;
                default:
                    break;
            }

            if(letter === "," || letter === "." || letter === "?"){
                const annaIdleAnimation = anna.animations.idle;
                const randomIter = getRandomArbitrary(0, annaIdleAnimation.length);
                if(!animationOff)
                    setMessageEmotion(annaIdleAnimation[randomIter]);
            }
            else{
                if(!animationOff)
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
    
    function showMessage(text, autor = "Анна", emotion, timeout = 20,
        soundOff = false, animationOff = false){ 
        fullMessageText = text;    
        let ms = timeout;
        if(emotion){
            idleAnimationStarted = true;
            setMessageEmotion(emotion);
            setTimeout(() => {
                idleAnimationStarted = false;
            }, 500);
        }            
        firstMessageNotRunned = false;
        setMessageAutor(autor);
        
        if(timeout){
            new Promise(async resolve => {
                messageCompleted = false;
                await runText(text, setMessageText, ms, soundOff, animationOff);
                resolve(1);
            }).then(async () => {
                if(skipMessageWhileComplete){
                    await timeOut(300);
                    nextMessage();
                }
                else{
                    if(functionAfterMessage)
                        functionAfterMessage();
                    messageCompleted = true;
                    messageSkipped = false;
                }
             });
        }
        else{
            setMessageText(text);
            messageCompleted = true;
            messageSkipped = false;
        }       
    }

    useEffect(() => {
        if(modalWindowFinished && !modalWindowStarted){
            stopClick = false;
        }
    }, [nextMessage, stopClick])

    function waitMessage(callback, notTimeout = true){
        const interval = setInterval(() => {
            if(messageCompleted){
                if(!notTimeout){
                    callback();
                    console.log("hello")
                    clearInterval();
                }
                setTimeout(() => {
                    callback();
                    clearInterval(interval);
                }, 500);
            }
        }, 10);
    }

    function nextMessage(choiceLine){
        localStorage.setItem("messageCounter", messageCounter.toString());
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

        skipMessageWhileComplete = currentDialog?.nextMessage;
        functionAfterMessage = currentDialog?.functionAfterMessage;

        setMessageReaction(currentDialog?.reaction);
        currentDialog?.callbackOutside();
        setTransformVoicerClasses(currentDialog?.transformVoicerClasses);

        setGameOver(currentDialog?.finished);

        if(currentDialog?.runMusic) 
        {
            scene.currentMusic.play();
            scene.currentMusic.loop = true;
            scene.ambience.play();
            scene.ambience.loop = true;
            setAudioButtonState(true);
        }

        setAnimationStopped(currentDialog?.allAnimationStop ? currentDialog?.allAnimationStop : false);
        setSingleEmotion(currentDialog?.emotion);
        showMessage(
            currentDialog?.messageText, currentDialog?.autor,
            currentDialog?.emotion, currentDialog?.timeout, currentDialog?.soundOff,
            currentDialog?.animationOff
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
                    return stopClick ? "message-block" : "message-block completed"; 
                else if(!messageCompleted && !choices)
                    return stopClick ? "message-block" : "message-block not-completed"
                else 
                    return "message-block"
            })()}
            data-choiced={choices ? "choices-true" : "choices-false"}
            onClick={(() => {
                if(stopClick || skipMessageWhileComplete)
                    return null;
                if(messageCompleted && !choices){
                    return () => nextMessage(variants);
                }                    
                else if(!messageCompleted)
                    return () => messageSkipped = true;
                else 
                    return null
            })()}
            data-windowed={ windowed ? "window" : "not-window"}
            data-messageautor={messageAutor}
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
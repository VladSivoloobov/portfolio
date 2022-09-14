import React from "react";
import { Choice } from "../Choice/Choice";
import "./MessageText.css";

export const MessageText = ({messageText, choices, 
    anna, variants, fullMessageText, 
    setVariants, nextMessage, messageCompleted}) => (
    <div className="message-text" data-text={fullMessageText} data-waittext={messageText}>
    {
        messageText.split(" ").map((word, wordIndex) => (
            <span key={wordIndex} className="text">
                <span className="word" data-word={fullMessageText.split(" ")[wordIndex]}
                data-waitword={word}>
                {
                    word.split("").map((letter, letterIndex) => (
                        <span key={letterIndex} className="letter" 
                            data-letter={fullMessageText.split(" ")[wordIndex].split("")[letterIndex]}
                            data-waitletter={letter}>
                                {letter}
                        </span>
                    ))
                }   
                </span>
                <span className="space"> </span>
            </span>
            
        ))
    }
    {choices && messageCompleted ? <Choice
                anna={anna} choice={choices} 
                variants={variants}
                setVariants={setVariants}
                nextMessage={nextMessage}/> : <div></div>}
    </div>
)
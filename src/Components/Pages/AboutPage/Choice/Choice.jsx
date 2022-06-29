import React from "react";
import "./Choices.css";
import "./Choices_mobile.css";

export function Choice({nextMessage, setMessageCounter, messageCounter, anna, choices, setChoices, setChoiceLineState}){
    return (
        <div className="choices">
            {choices.map((choice, index) => (
                <div key={index} onClick={() => {
                    switch(choice.point.pointType){
                        case "enemy":
                            anna.enemyPoints += choice.point.pointCount;
                        case "friend":
                            anna.friendPoints += choice.point.pointCount;
                        case "love":
                            anna.friendPoints += choice.point.pointCount;
                    }
                    setChoiceLineState(choice.choiceLine);
                    setChoices(null);
                    nextMessage(choice.choiceLine);
                }} className="choice">{choice.choiceText}</div>
            ))}
        </div>
    )
}
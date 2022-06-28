import React from "react";

export function Choice({choices}){
    return (
        <div className="choices">
            {choices.map(choice => (
                <div className="choice">{choice.text}</div>
            ))}
        </div>
    )
}
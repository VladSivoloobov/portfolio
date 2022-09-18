import React from "react";
import "./Choices.css";
import "./Choices_mobile.css";

export function Choice({nextMessage, anna, choice, setVariants, variants}){
    return (
        <div className="choices">
            {choice.variants.map((variant, index) => (
                <div key={index} onClick={() => {
                    setVariants(variant);
                    nextMessage(variant);
                }} className="choice">{variant.variantText}</div>
            ))}
        </div>
    )
}
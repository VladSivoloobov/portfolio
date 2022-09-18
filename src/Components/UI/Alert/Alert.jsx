import React from "react";

export const Alert = ({title, description}) => {
    return (
        <div className="alert">
            <h2 className="alert-title">
                {title}
            </h2>
            <p className="alert-description">
                {description}
            </p>
        </div>
    )
}
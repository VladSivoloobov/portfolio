import React from "react";
import "./ErrorPage.css";

export function ErrorPage() {
    return (
        <div className="errorPage">
            <h1>Нет подключения к Интернету</h1>
            <p>Попробуйте сделать следующее:</p>
            <ul>
                <li>Проверьте сетевые кабели, модем или маршрутизатор.</li>
                <li>Подключитесь к сети WI-FI ещё раз.</li>
            </ul>
            <p>ERR_INTERNET_DISCONNECTED</p>
        </div>
    )
}
import "./SettingsPage.css";

export function SettingsPage({qualityMax, audioOn, setQualityMax, setSettingsClicked}){
    return(
        <div className="settingsPage">
            <div className="settingsPage__header">
                <button onClick={() => {
                    setSettingsClicked(false);
                }} className="back">{"< Назад"}</button>
                <h2 className="settingsPage__title">Параметры</h2>
            </div>
            <div className="settingsPage__settings">
                <button onClick={() => setQualityMax(!qualityMax)} className="quality">Качество: {qualityMax ? "Максимальное" : "Производительность"}</button>
            </div>
        </div>
    )
}
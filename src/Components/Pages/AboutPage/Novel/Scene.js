import funnyMusic from "./src/sound/ost.mp3";
import barBackground from "../../../../img/bg.gif";

let instance;

export class Scene{
    constructor(setAudioButtonState){
        if(setAudioButtonState)
            this.setAudioButtonState = setAudioButtonState;
        if(!instance) instance = this;
        return instance;
    }
    background = barBackground;
    currentMusic = new Audio(funnyMusic);
    musicPlayed;
    changeMusic(music){
        this.currentMusic = new Audio(music);
    }
}
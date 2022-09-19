import ost from "./src/sound/ost.mp3";
import barBackground from "../../../../img/bg.gif";
import ambience from "./src/sound/ambience.mp3";
import dream from "./src/sound/dream.mp3";
import voice from "./src/sound/voice.mp3";
import angryVoice from "./src/sound/angryVoice.mp3";
import maleVoice from "./src/sound/playerVoice_male.mp3";
import femaleVoice from "./src/sound/playerVoice_female.mp3";
import cold_short from "./src/sound/Cold/cold_short.mp3";
import cold_long from "./src/sound/Cold/cold_long.mp3";

import annaCloseBackground from "./src/annaClosed.gif";
import horrorMusic from "./src/sound/horror.mp3";
import sadHorror from "./src/sound/horrorSad.mp3";

export class Scene{
    static secondBackground;
    static background = barBackground;
    currentMusic = new Audio(ost);
    static backgrounds = {
        barBackground,
        annaCloseBackground
    }
    static brokenPage = false;
    musicPlayed;
    ambience = new Audio(ambience);
    changeMusic(music){
        this.currentMusic.pause();
        switch(music){
            case "ost":
                this.currentMusic = new Audio(ost);
                break;
            case "dream":
                this.currentMusic = new Audio(dream);
                break;
            case "cold":
                this.currentMusic = new Audio(cold_short);
                this.currentMusic.volume = 1;
                break;
            case "cold-long":
                this.currentMusic = new Audio(cold_long);
                break;
            case "horror":
                this.currentMusic = new Audio(horrorMusic);
                break;
            case "sad-horror":
                this.currentMusic = new Audio(sadHorror);
        }
        this.currentMusic.loop = true;
        this.currentMusic.play();
    }
    
    static voices = {
        voice,
        angryVoice,
        maleVoice,
        femaleVoice
    }

    static voice = voice;
}
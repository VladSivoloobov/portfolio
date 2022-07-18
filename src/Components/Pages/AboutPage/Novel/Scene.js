import funnyMusic from "./src/sound/ost.mp3";
import barBackground from "../../../../img/bg.gif";
import ambience from "./src/sound/ambience.mp3";

export class Scene{
    background = barBackground;
    currentMusic = new Audio(funnyMusic);
    musicPlayed;
    ambience = new Audio(ambience);
    changeMusic(music){
        this.currentMusic = new Audio(music);
    }
}
import ost from "./src/sound/ost.mp3";
import barBackground from "../../../../img/bg.gif";
import ambience from "./src/sound/ambience.mp3";
import dream from "./src/sound/dream.mp3";


export class Scene{
    background = barBackground;
    currentMusic = new Audio(ost);
    musicPlayed;
    ambience = new Audio(ambience);
    changeMusic(music){
        switch(music){
            case "ost":
                this.currentMusic.pause();
                this.currentMusic = new Audio(ost);
                this.currentMusic.play();
                break;
            case "dream":
                this.currentMusic.pause();
                this.currentMusic = new Audio(dream);
                this.currentMusic.play();
                break;
        }
    }
}
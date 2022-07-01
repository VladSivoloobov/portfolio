import funnyMusic from "./src/sound/ost.mp3";
import barBackground from "../../../../img/bg.gif";
import memoriesBackground from "./src/memories.gif";


export class Scene{
    background = barBackground;
    currentMusic = new Audio(funnyMusic);
    changeMusic(music){
        this.currentMusic = new Audio(music);
    }

    changeBackground(background){
        switch(background){
            case "memories":
                this.background = memoriesBackground;
                break;
            case "barBackground":
                this.background = barBackground;
                break;
        }
    }
}
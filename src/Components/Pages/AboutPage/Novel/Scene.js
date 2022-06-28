import funnyMusic from "./src/sound/ost.mp3";

export class Scene{
    background;
    currentMusic = new Audio(funnyMusic);
    changeMusic(music){
        this.currentMusic = new Audio(music);
    }
}
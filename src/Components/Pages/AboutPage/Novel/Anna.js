import happy from "./src/anna/tile001.png";
import baffled from "./src/anna/tile002.png";
import closedEyes from "./src/anna/tile003.png";
import scornful from "./src/anna/tile004.png";
import dreamed from "./src/anna/tile005.png";
import tired from "./src/anna/tile006.png";
import smile from "./src/anna/tile000.png";

import animationTalk_0 from "./src/anna/animation/talking/talk_0.png";
import animationTalk_2 from "./src/anna/animation/talking/talk_2.png";
import animationTalk_3 from "./src/anna/animation/talking/talk_3.png";

import animatitonIdle_0 from "./src/anna/animation/idle/idle_0.png";
import animatitonIdle_1 from "./src/anna/animation/idle/idle_1.png"
import animatitonIdle_2 from "./src/anna/animation/idle/idle_2.png"
import animatitonIdle_3 from "./src/anna/animation/idle/idle_3.png"
import animatitonIdle_4 from "./src/anna/animation/idle/idle_4.png"

import voice from "./src/sound/voice.mp3";
import angryVoice from "./src/sound/angryVoice.mp3";

let instance;

export class Anna{
    constructor(){
        if(!instance) instance = this;
        return instance;
    }
    lovePoints = 0;
    friendPoints = 0;
    enemyPoints = 0;
    emotions = {
        // Анна обычная
        smile, // Анна улыбается
        happy, // Анна счастлива
        baffled, // Анна задумчива
        closedEyes, // Анна закрыла глаза
        scornful, // Анна презрительна
        dreamed, // Анна мечтательна
        tired, // Анна устала
    }
    voice = voice;
    changeVoice({angry, standard}){
        if(angry){
            this.voice = angryVoice
        }
        else if(standard){
            this.voice = voice
        }
    }

    animations = {
        talking: [
            animationTalk_0,
            animationTalk_0,
            animationTalk_0,
            animationTalk_2,
            animationTalk_2,
            animationTalk_2,
            animationTalk_3,
            animationTalk_3,
            animationTalk_3,
        ],
        idle: [
            animatitonIdle_0,
            animatitonIdle_1,
            animatitonIdle_2,
            animatitonIdle_3,
            animatitonIdle_4
        ]
    }
}
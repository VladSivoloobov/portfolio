import happy from "./src/anna/tile001.png";
import baffled from "./src/anna/tile002.png";
import closedEyes from "./src/anna/tile003.png";
import scornful from "./src/anna/tile004.png";
import dreamed from "./src/anna/tile005.png";
import tired from "./src/anna/tile006.png";
import smile from "./src/anna/tile000.png";

import voice from "./src/sound/voice.mp3";

export class Anna{
    lovePoints = 0;
    friendPoints = 0;
    enemyPoints = 0;
    emotions = {
        smile, // Анна улыбается
        happy, // Анна счастлива
        baffled, // Анна задумчива
        closedEyes, // Анна закрыла глаза
        scornful, // Анна презрительна
        dreamed, // Анна мечтательна
        tired // Анна устала
    }
    voice = voice;
}
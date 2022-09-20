export class Dialog{
    type = "Dialog";
    constructor(
        { 
            messageText, autor, timeout = 40, stopMusic = false, 
            runMusic = false, animation, emotion, choice, callbackInside,
            callbackOutside, textEffects, theme = "#100931", reaction, params,
            soundOff = false, animationOff = false, transformVoicerClasses, 
            allAnimationStop = false, nextMessage = false, functionAfterMessage,
            finished = false
        }, 
    ){
        
        this.messageText = messageText;
        this.autor = autor;
        this.timeout = timeout;
        this.stopMusic = stopMusic;
        this.runMusic = runMusic;
        this.animation = animation;
        this.emotion = emotion;
        this.choice = choice;
        this.theme = theme;
        this.reaction = reaction;
        this.params = params;
        this.soundOff = soundOff;
        this.animationOff = animationOff;
        this.transformVoicerClasses = transformVoicerClasses;
        this.allAnimationStop = allAnimationStop;
        this.nextMessage = nextMessage;
        this.functionAfterMessage = functionAfterMessage;
        this.finished = finished;

        this.callbackOutside = callback => {
            if(callback)
                callback();
            return ((props, callback) => {
                if(callback)
                    callback(props);
            })(this, callbackOutside);
        };

        if(callbackInside)
            callbackInside(this);
            
        this.textEffects = textEffects;
    }

    static genderMessage(gender, { maleMessage, femaleMessage }){
        switch(gender){
            case "Парень":
                return maleMessage;
            case "Девушка":
                return femaleMessage;
        }
    }
}

export class BackgroundDialog extends Dialog{
    type = "BackgroundDialog";
    constructor(props){
        super(props);
    }
}

export class FinishedDialog extends Dialog{
    type="FinishedDialog";
    constructor(){
        super({
            messageText: " "
        });
    }
}

export class TextEffect{
    constructor(text, className){
        this.text = text;
        this.class = className + " text-effect";
    }
}

export class Choice{
    constructor(
        { variants, child = false },
        callback
    ){
        this.variants = variants;
        this.child = child;
        if(callback)
            callback(this);
    }
}
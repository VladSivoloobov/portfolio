export class Dialog{
    type = "Dialog";
    constructor(
        { 
            messageText, autor, timeout = 40, stopMusic = false, 
            runMusic = false, animation, emotion, choice, callbackInside,
            callbackOutside, textEffects, theme = "#100931", reaction, params,
            soundOff = false
        }, 
    ){
        if(!messageText)
            throw "MessageText Empty";
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
}

export class BackgroundDialog extends Dialog{
    type = "BackgroundDialog";
    constructor(
        {
            messageText, timeout = 80,
            stopMusic = false, runMusic = true,
            callbackInside, callbackOutside, textEffects, theme = "#000"
        }
    ){
        super({
            messageText, timeout,
            stopMusic, runMusic, callbackInside,
            callbackOutside, textEffects, theme
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
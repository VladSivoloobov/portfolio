export class Dialog{
    constructor(
        { 
            messageText, autor, timeout = 40, stopMusic = false, 
            runMusic = false, animation, emotion, choice, callbackInside,
            callbackOutside 
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
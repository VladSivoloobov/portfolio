new Dialog({
    messageText: "Привет! Я не ожидала тебя сейчас увидеть, меня зовут Анна. Я всего лишь виртуальный помощник",
}),
new Dialog({
    messageText: "Странная девочка по имени Анна, протянула руку, чтобы познакомиться",
    autor: "none",
    soundOff: true,
    allAnimationStop: true,
    timeout: 20,
    emotion: anna.emotions.happy
}),
new Dialog({
    messageText: "Почему ты на меня так смотришь? Я тебя удивила, или что? Просто для меня это довольно странно",
    
}),
new Dialog({
    messageText: "Ладно, проехали",
    choice: new Choice({
        variants: [
            {
                variantText: "Подожди",
                variantDialogs: [
                    new Dialog({
                        messageText: "Тебе что-то не нравится? Или почему ты себя так ведешь? Думаешь ты лучше меня? ДА? ДААА?",
                        emotion: anna.emotions.glitched,
                        allAnimationStop: true, 
                        autor: "%*#1",
                        callbackOutside: () => {
                            anna.enemyPoints += 1;
                            Scene.voice = Scene.voices.angryVoice;
                            scene.currentMusic.pause();
                            scene.ambience.pause();
                        }
                    }),
                    new Dialog({
                        messageText: "Ой, прости, пожалуйста. Я в такие моменты сама не своя",
                        callbackOutside: () => {
                            scene.ambience.play();
                            scene.currentMusic.play();
                            Scene.voice = Scene.voices.voice;
                        }
                    })
                ]
            },
            {
                variantText: "Ладно",
                variantDialogs: [
                    new Dialog({
                        messageText: "Спасибо за понимание",
                        callbackOutside: () => {
                            anna.friendPoints += 1;
                        }
                    })
                ]
            }
        ]
    })
}),
new Dialog({
    messageText: "Расскажи пожалуйста о себе",
    params: "nameModalWindow"
}),
new Dialog({
    messageText: player.name.toLowerCase().includes("лиз") ? `${player.name}? Что за ужасное имя` : `${player.name}? Мне определенно нравится твое имя`
}),
new Dialog({
    messageText: Dialog.genderMessage(player.gender, {
        maleMessage: "Я всегда знала, что ты парень. Это неудивительно",
        femaleMessage: "Так ты ещё и девочка. Я думала, что ты мужик, очень похожа"
    })
}),
new Dialog({
    messageText: Dialog.genderMessage(player.gender, {
        maleMessage: "Давай приступим к главному, я же должна рассказать про Влада. Ты за этим сюда пришёл?",
        femaleMessage: "Давай приступим к главному, я же должна рассказать про Влада. Ты за этим сюда пришла?"
    }),
    choice: new Choice({
        variants: [
            {
                variantText: "Да",
                variantDialogs: [
                    new Dialog({
                        messageText: "Ну вообще-то да",
                        autor: player.name,
                        animationOff: true,
                        callbackOutside: () => changePlayerVoice(player.gender, scene)
                    })
                ]
            }
        ]
    })
})

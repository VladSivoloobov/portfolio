 export const dialogs = (scene, player, anna) => {
    return (
        [
            new Dialog({
                messageText: "Привет! Меня зовут Анна. Я создана для того, чтобы рассказать тебе о Владе",
                autor: "Анна",
            }),
            new Dialog({
                messageText: "В параметрах ты можешь изменить качество картинки, чтобы ускорить работу сайта",
                autor: "Анна",
            }),
            new Dialog({
                messageText: "В данный момент его тут нету, он не говорил, куда ушёл. Просто оставив меня на этом сайте за главную",
                autor: "Анна",
            }),
            new Dialog({
                messageText: "Кстати, ты можешь включить музыку и услышать мой голос нажав на кнопку слева сверху. А ещё я могу один раз это сделать за тебя",
                autor: "Анна",
                choice: new Choice({
                    variants: [
                        {
                            variantText: "Включи",
                            variantDialogs: [
                                new Dialog({
                                    messageText: "Хорошо, я включу музыку",
                                    autor: "Анна",
                                    runMusic: true,
                                    callbackOutside: (props) => {
                                        if(scene.musicPlayed)
                                            props.messageText = "Но ведь музыка уже включена. Я не могу включить то, что итак работает, хихи"
                                    }
                                })
                            ]
                        },
                        {
                            variantText: "Не включай",
                            variantDialogs: [
                                new Dialog({
                                    messageText: "Не буду включать",
                                    callbackOutside: (props) => {
                                        if(scene.musicPlayed)
                                            props.messageText = "Да, я тоже так думаю, ведь музыка уже включена. Я могу только отключить её"
                                    }
                                })
                            ]
                        }
                    ],
                })
            }),
            new Dialog({
                messageText: "Я же о тебе совсем не знаю, расскажи о себе",
                params: "nameModalWindow",
            }),
            new Dialog({
                messageText: "Зачем ты сюда зашёл?",
                choice: new Choice({
                    variants: [
                        {
                            variantText: "Просто",
                            variantDialogs: [
                                new Dialog({
                                    messageText: "Я никогда не поверю, что ты сюда зашёл просто так",
                                    callbackInside: (props) => {
                                        const date = new Date();
                                        props.messageText += ` в ${date.getHours()} час, ${date.getHours() > 21 || date.getHours < 6 ? "это очень поздно" : "тебе делать нечего?"}`
                                    }
                                })
                            ]
                        },
                        {
                            variantText: "Ради тебя",
                            variantDialogs: [
                                new Dialog({
                                    messageText: "Уж прости, я не поведусь на эти пустые слова. Но мне очень приятно",
                                    reaction: "heartbreak"
                                }),
                                new Dialog({
                                    messageText: "И что же во мне такого особенного, что ты сюда зашёл ради меня? Хаха, ладно, давай забудем об этом",
                                })
                            ]
                        }
                    ]
                })
            }),
            new Dialog({
                messageText: player.name + ", " + "Однажды, в один какой-то день Влад создал меня и сказал, чтобы я сидела на этом сайте и ждала кого-то, кто сюда зайдёт"
            }),
            new Dialog({
                messageText: "Он создал этот сайт, чтобы показать свои работы, но его фантазия пошла куда-то не туда, и так появилась я. Слишком детская и странная"
            }),
            new Dialog({
                messageText: "А что, если и даже сейчас я говорю теми фразами, которые придумал он мне?"
            }),
            new Dialog({
                messageText: "А что, если и ты зашёл на этот сайт только потому, что кто-то заранее этого хотел",
                choice: new Choice({
                    variants: [
                        {
                            variantText: "Возможно",
                            variantDialogs: [
                                new Dialog({
                                    messageText: "Это очень странная теория, давай лучше поговорим о чём-то другом, чтобы ты не считал меня странной",
                                    autor: "Анна",
                                })
                            ],
                        },
                        {
                            variantText: "Ты шизанутая?",
                            variantDialogs: [
                                new Dialog({
                                    messageText: "У каждого правда своя, и поэтому я не буду тебя осуждать за то, что ты не согласен с моими мыслями",
                                    autor: "Анна",
                                }),
                                new Dialog({
                                    messageText: "Но мне совершенно не нравится, что ты меня назвал шизанутой, я это тебе припомню",
                                }),
                                new Dialog({
                                    messageText: "Ладно, я так поняла, что тебе эта тема совершенно не понравилась, что ты меня даже назвал шизанутой, давай поговорим о чём-то другом"
                                })
                            ]
                        }
                    ]
                })
            }),
            new Dialog({
                messageText: "О чём поговорим?",
                choice: new Choice({
                    variants: [
                        {
                            variantText: "О погоде",
                            variantDialogs: [
                                new Dialog({
                                    messageText: "О погоде? Ты серьёзно? Ахахаххаха"
                                }),
                                new Dialog({
                                    messageText: "В москве сейчас 10 градусов"
                                }),
                                new Dialog({
                                    messageText: "Прекрасная погода"
                                })
                            ]
                        },
                        {
                            variantText: "О спорте",
                            variantDialogs: [
                                new Dialog({
                                    messageText: "Я не люблю спорт, если ты считаешь эту тему прикольной, то у меня к тебе плохие новости"
                                })
                            ]
                        },
                        {
                            variantText: "Ты красивая",
                            variantDialogs: [
                                new Dialog({
                                    messageText: "Я итак знаю, что я красивая, зачем это снова обсуждать?"
                                })
                            ]
                        }
                    ]
                })
            }),
            new Dialog({
                messageText: "Все работы вы можете увидеть на его github"
            }),
            new BackgroundDialog({
                messageText: "Я всё не могу понять",
                callbackOutside: (props) => {
                    scene.changeMusic("dream");
                }
            }),
            new BackgroundDialog({
                messageText: "Почему ты до сих пор на этом сайте",
                timeout: 100,
                textEffects: [
                    new TextEffect("Что тобою движет?", "right-side pink"),
                    new TextEffect("Зачем?", "left-side pink")
                ]
            }),
            new BackgroundDialog({
                messageText: "Я никогда и не могла подумать, что я найду такого друга, как ты"
            }),
            new BackgroundDialog({
                messageText: "На этом ознакомительная версия окончена"
            }),
            new Dialog({
                messageText: "Норм так-то"
            })
        ]
    )
}

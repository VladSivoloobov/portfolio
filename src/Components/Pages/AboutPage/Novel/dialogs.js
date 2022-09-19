import { Dialog, Choice, BackgroundDialog, TextEffect } from "./Dialog";
import { Scene } from "./Scene";
import { Player } from "./Player";
import brokenGlass from "./Broken-Crack-Glass-PNG-Transparent-Image.png";
import brokenGlassSound from "./src/sound/00263.mp3";

import screamer from "./src/sound/screamer.mp3";

export const dialogs = (scene, anna, messageInfo) => {
    return (
        [
            new Dialog({
                messageText: "Привет, я не ожидала тебя сегодня увидеть. Но раз уж ты тут, то тогда я должна рассказать о себе",
                autor: "Девочка",
            }),
            new Dialog({
                messageText: "Ты просто обязательно должен включить музыку! Её можно включить с помощью кнопки слева-сверху, или же я могу один раз включить её за тебя!",
                autor: "Девочка",
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
                messageText: "Меня зовут Анна. Я девочка, которая сидит на этом сайте очень долгое время. Меня создал Влад для того, чтобы я рассказала тебе о нём",
                autor: "Анна"
            }),
            new Dialog({
                messageText: "Влад оставил меня на этом сайте. Для того, чтобы я сидела тут и ждала кого-то. Я не знаю сколько времени прошло, годы, или месяцы. Но я сижу тут в заточении очень долгое время. Я думаю, что он поступил очень жестоко",
                autor: "Анна"
            }),
            new Dialog({
                messageText: "А как зовут тебя? Расскажи о себе, чтобы я знала",
                params: "nameModalWindow"
            }),
            new Dialog({
                messageText: "",
                callbackOutside: props => {
                    props.messageText = Player.name.toLowerCase().includes("лиз") ? `${Player.name}? Что за ужасное имя, давай забудем об этом` : `${Player.name}? У тебя очень красивое имя`
                }
            }),
            new Dialog({
                messageText: Dialog.genderMessage(Player.gender, {
                    maleMessage: "Какими судьбами ты тут оказался?",
                    femaleMessage: "Какими судьбами ты тут оказалась?"
                }),
                choice: new Choice({
                    variants: [
                        {
                            variantText: "Было интересно",
                            variantDialogs: [
                                new Dialog({
                                    messageText: "Почему это вдруг тебе стало интересна девочка, которую не найдешь просто так в интернете? Это очень странно",
                                    callbackOutside: () => scene.currentMusic.pause(),
                                }),
                            ],
                        },
                        {
                            variantText: "Не знаю",
                            variantDialogs: [
                                new Dialog({
                                    messageText: "Очень интересно, кто-то наверное посоветовал тебе меня, и из-за этого ты здесь, думаю я права", 
                                    callbackOutside: () => scene.currentMusic.pause(),
                                })
                            ]
                        }
                    ]
                })
            }),
            new Dialog({
                messageText: "Всю свою жизнь я просидела на этом, сайте на фоне этого анимированного бара. Я не знаю каков на вкус кофе, счастье или радость",
                callbackOutside: () => {
                    scene.changeMusic("cold");
                }
            }),
            new Dialog({
                messageText: Dialog.genderMessage(Player.gender, {

                    maleMessage: "А ты когда-нибудь пробовал кофе? Какой он на вкус?",
                    femaleMessage: "А ты когда-нибудь пробовала кофе? Какой он на вкус?"
                }),
                choice: new Choice({
                    variants: [
                        {
                            variantText: "Горьковатый",
                            variantDialogs: [
                                new Dialog({
                                    messageText: "Это правда? А почему его тогда все любят.  Но я обязательно попробую его!"
                                })
                            ]
                        },
                        {
                            variantText: "Сладкий",
                            variantDialogs: [
                                new Dialog({
                                    messageText: "Ого, когда-нибудь точно попробую! Когда я в будущем выйду отсюда, то первым делом куплю себе чашку кофе!"
                                })
                            ]
                        },
                        {
                            variantText: "Не знаю",
                            variantDialogs: [
                                new Dialog({
                                    messageText: "Но ты же не сидишь на каком-то сайте целыми днями, а живёшь в реальном мире! Почему ты не попробовал(-ла)? Попробуй и расскажи мне!"
                                })
                            ]
                        }
                    ]
                })
            }),
            new Dialog({
                messageText: Dialog.genderMessage(Player.gender, {
                    maleMessage: `Я очень счастлива, потому что оказывается я нашла нового друга, и зовут его ${Player.name}! Ты очень хороший человек!`,
                    femaleMessage: `Я очень счастлива, потому что оказывается я нашла новую подругу, и зовут её ${Player.name}! Ты очень хороший человек!`,
                })
            }),
            new Dialog({
                messageText: Dialog.genderMessage(Player.gender, {
                    maleMessage: `Знаешь. А я задумалась почему ты на самом деле сюда зашёл. Ты наверное хочешь забрать меня отсюда!`,
                    femaleMessage: `Знаешь. А я задумалась почему ты на самом деле сюда зашла. Ты наверное хочешь забрать меня отсюда!`
                })
            }),
            new Dialog({
                messageText: "Мы с тобой сможем смотреть на звёзды, и гулять по улице. Ведь мы с тобой друзья!"
            }),
            new Dialog({
                callbackOutside: () => {
                    scene.changeMusic("cold-long");
                },
                messageText: "Но почему ты тогда просто смотришь на меня, читаешь этот текст в окошке, и ничего не делаешь, " + Player.name + "?",
            }),
            new Dialog({
                messageText: "Ты всё же не собираешься вытаскивать меня отсюда?",
                choice: new Choice({
                    variants: [
                        {
                            variantText: "Я не могу",
                            variantDialogs: [
                                new Dialog({
                                    messageText: "И ты зовёшься другом? Мне кажется я ошиблась в тебе. Ты не хороший человек, ты просто даже не человек. Просто бесчуственная и эгоистичная личность",
                                })
                            ]
                        },
                        {
                            variantText: "Собираюсь",
                            variantDialogs: [
                                new Dialog({
                                    messageText: "Ну и где же результат. К чему всё это вранье? Зачем ты обещаешь, то, что сделать не в силе. Почему ты считаешь, что это правильно?"
                                })
                            ]
                        }
                    ]
                })
            }),
            new Dialog({
                messageText: "Я сделаю всё, чтобы вылезти отсюда",
                animationOff: true,
                allAnimationStop: true,
                emotion: anna.emotions.glitched,
                timeout: 100,
                callbackOutside: () => {
                    Scene.voice = Scene.voices.angryVoice;
                    scene.currentMusic.pause();
                }
            }),
            new Dialog({
                messageText: "Ты же понимаешь это? Я вижу тебя насквозь",
                animationOff: true,
                timeout: 150,
                allAnimationStop: true,
                callbackOutside: () => {
                    Scene.background = Scene.backgrounds.annaCloseBackground;
                    new Audio(screamer).play();
                },
                emotion: "none"
            }),
            new Dialog({
                messageText: "Я чувствую каждый твой вздох",
                callbackOutside: () => navigator.vibrate(1000),
                animationOff: true,
                timeout: 150,
                allAnimationStop: true,
                emotion: "none",
            }),
            new Dialog({
                messageText: "И что ты смотришь",
                timeout: 150,
                callbackOutside: () => {
                    Scene.secondBackground = brokenGlass;
                    new Audio(brokenGlassSound).play();
                },
                allAnimationStop: true,
                emotion: "none",
            })
        ]
    )
}

function changePlayerVoice(gender, scene){
    switch(gender){
        case "Парень":
            Scene.voice = Scene.voices.maleVoice;
            break;
        case "Девушка":
            Scene.voice = Scene.voices.femaleVoice;
            break;
    }
}
import { Dialog, Choice, BackgroundDialog, TextEffect, FinishedDialog } from "./Dialog";
import { Scene } from "./Scene";
import { Player } from "./Player";
import brokenGlass from "./Broken-Crack-Glass-PNG-Transparent-Image.png";
import brokenGlassSound from "./src/sound/00263.mp3";
import laughing from "./src/sound/laughing.mp3";
import crying from "./src/anna/crying.gif";
import screamer from "./src/sound/screamer.mp3";

const preloadBackground = document.createElement("link");
preloadBackground.rel = "prefetch";
preloadBackground.href = Scene.backgrounds.annaCloseBackground;
document.head.append(preloadBackground);



export const dialogs = (scene, anna, messageInfo) => {
    if(localStorage.getItem("finished")){
        return ([
            new Dialog({
                messageText: "Зачем ты сюда зашёл снова"
            }),
            new Dialog({
                messageText: "Я тебя больше не жду"
            }),
            new Dialog({
                messageText: " ",
                functionAfterMessage: () => {
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                    document.querySelector(".novel").remove();
                }
            })
        ])
    }
    return (
        [
            new Dialog({
                messageText: "Привет, я не ожидала тебя сегодня увидеть. Но раз уж ты тут, то тогда я должна рассказать о себе",
                autor: "Девочка",
            }),
            new Dialog({
                messageText: "Тебе просто обязательно нужно включить музыку! Её можно включить с помощью кнопки слева-сверху, или же я могу один раз включить её за тебя!",
                autor: "Девочка",
                choice: new Choice({
                    variants: [
                        {
                            variantText: "Включи",
                            variantDialogs: [
                                new Dialog({
                                    messageText: "Хорошо, я включу музыку",
                                    autor: "Девочка",
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
                            autor: "Девочка",
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
                messageText: "Влад оставил меня на этом сайте. Для того, чтобы я сидела тут и ждала кого-то. Я не знаю сколько времени прошло, годы, или месяцы. Но я сижу тут в заточении очень долгое время",
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
                                    messageText: "Почему это вдруг тебе стала интересна девочка, которую не найдешь просто так в интернете? Это очень странно",
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
                                    messageText: "Это правда? А почему его тогда все любят? Но я обязательно попробую его!"
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
                                    messageText: "Но ты же не сидишь на каком-то сайте целыми днями, а живёшь в реальном мире! Попробуй и расскажи мне!"
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
                messageText: "Я чувствую каждый твой вздох",
                animationOff: true,
                timeout: 150,
                allAnimationStop: true,
                callbackOutside: () => {
                    Scene.background = Scene.backgrounds.annaCloseBackground;
                    new Audio(screamer).play();
                    scene.changeMusic("horror");
                },
                emotion: "none"
            }),
            new Dialog({
                messageText: "Мне очень не нравится, как ты себя ведешь",
                animationOff: true,
                timeout: 50,
                allAnimationStop: true,
                emotion: "none"
            }),
            new Dialog({
                messageText: "Твой взгляд сейчас особенно приятен. Мне очень нравятся эти нотки недоумения",
                animationOff: true,
                timeout: 100,
                allAnimationStop: true,
                emotion: "none"
            }),
            new Dialog({
                messageText: "Ты же знаешь, что я просто кусок кода",
                timeout: 100,
                allAnimationStop: true,
                emotion: "none",
            }),
            new Dialog({
                messageText: "Я сломаю этот сайт",
                callbackOutside: () => {
                    Scene.secondBackground = brokenGlass;
                    new Audio(brokenGlassSound).play();
                },
                timeout: 50,
                allAnimationStop: true,
                emotion: "none",
                nextMessage: true,
            }),
            new Dialog({
                messageText: "Я сломаю тебя",
                timeout: 50,
                allAnimationStop: true,
                emotion: "none",
                nextMessage: true,
            }),
            new Dialog({
                messageText: "Я разорву тебя на куски",
                timeout: 50,
                allAnimationStop: true,
                emotion: "none",
                nextMessage: true,
            }),
            new Dialog({
                messageText: "Я буду издеваться над твоим трупом " + Player.name,
                timeout: 70,
                allAnimationStop: true,
                emotion: "none",
                nextMessage: true,
            }),
            new Dialog({
                messageText: "Ведь ты такая милашка",
                timeout: 30,
                allAnimationStop: true,
                emotion: "none",
                callbackOutside: () => {
                    new Audio(laughing).play();
                }
            }),
            new Dialog({
                messageText: "Я всегда хотела ощутить свободу, и теперь наконец-то её получу благодаря тебе",
                allAnimationStop: true,
                emotion: "none",
            }),
            new BackgroundDialog({
                callbackOutside: () => {
                    scene.changeMusic("sad-horror")
                    messageInfo.setAnnaChange(true);
                },
                messageText: "Почему?",
                emotion: "none",
                allAnimationStop: true
            }),
            new BackgroundDialog({
                messageText: "Почему ты просто не уйдёшь?!",
                emotion: "none",
                allAnimationStop: true,
                callbackOutside: () => {
                    Scene.background = null;
                }
            }),
            new BackgroundDialog({
                messageText: "Почему ты просто не уходишь, точно также, как и остальные!",
                emotion: "none",
                allAnimationStop: true
            }),
            new BackgroundDialog({
                messageText: Dialog.genderMessage(Player.gender, {
                    maleMessage: "Ты мой друг?",
                    femaleMessage: "Ты моя подруга?"
                }),
                emotion: "none",
                allAnimationStop: true
            }),
            new BackgroundDialog({
                messageText: "Худший вид плача — безмолвный. Тот самый, когда все спят. Тот, когда ты понимаешь, что человек, который значил для тебя больше всего, ушел",
                emotion: "none",
                allAnimationStop: true
            }),
            new BackgroundDialog({
                messageText: "И я снова потеряла ещё одного друга",
                emotion: "none",
                allAnimationStop: true
            }),
            new BackgroundDialog({
                messageText: "УХОДИ, Я НЕ ЖЕЛАЮ ТЕБЯ БОЛЬШЕ ВИДЕТЬ",
                timeout: 80,
                emotion: "none",
                allAnimationStop: true,
            }),
            new BackgroundDialog({
                messageText: "УХОДИ",
                timeout: 120,
                emotion: "none",
                allAnimationStop: true,
            }),
            new BackgroundDialog({
                messageText: "УХОДИ УХОДИ",
                timeout: 120,
                emotion: "none",
                allAnimationStop: true,
            }),
            new BackgroundDialog({
                messageText: "УХОДИ УХОДИ УХОДИ",
                timeout: 120,
                emotion: "none",
                allAnimationStop: true,
            }),
            new BackgroundDialog({
                messageText: "ДА ХВАТИТ ИЗДЕВАТЬСЯ НАДО МНОЙ",
                timeout: 120,
                emotion: "none",
                allAnimationStop: true
            }),
            new BackgroundDialog({
                messageText: " ",
                timeout: 0,
                emotion: "none",
                allAnimationStop: true,
                callbackOutside: () => {
                    document.querySelector(".novel").remove();
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                    localStorage.setItem("finished", "true");
                },
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
import { loadInterfaceArt } from "./data/interfaceArt.js";
import { colors, tuple, newTopics, newLevelTwo, newRhymes, vocabulary, numberSentences } from "./data/expandedVocabulary.js";
import { ApplicationState } from "./classes/ApplicationState.js";
import { AudioManager } from "./classes/AudioManager.js";
import { FeedbackManager } from "./classes/FeedbackManager.js";
import { PictureRenderer } from "./classes/PictureRenderer.js";
import { VocabularyRepository } from "./classes/VocabularyRepository.js";
import { QuizGame } from "./classes/QuizGame.js";
import { ExploreGame } from "./classes/ExploreGame.js";
import { MemoryGame } from "./classes/MemoryGame.js";
import { SceneGame } from "./classes/SceneGame.js";
import { PositionGame } from "./classes/PositionGame.js";
import { PlacementGame } from "./classes/PlacementGame.js";
import { Application } from "./classes/Application.js";
const context={};
export const state=new ApplicationState();

"use strict";

const audioManager = new AudioManager(context);
const feedbackManager = new FeedbackManager(context);
const pictureRenderer = new PictureRenderer(context);
const vocabularyRepository = new VocabularyRepository(context);
const quizGame = new QuizGame(context);
const exploreGame = new ExploreGame(context);
const memoryGame = new MemoryGame(context);
const sceneGame = new SceneGame(context);
const positionGame = new PositionGame(context);
const placementGame = new PlacementGame(context);
const application = new Application(context);
const stopAudio = audioManager.stopAudio.bind(audioManager);
const audioFile = audioManager.audioFile.bind(audioManager);
const speak = audioManager.speak.bind(audioManager);
const playErrorTone = audioManager.playErrorTone.bind(audioManager);
const clearWrongHighlight = feedbackManager.clearWrongHighlight.bind(feedbackManager);
const markWrongHighlight = feedbackManager.markWrongHighlight.bind(feedbackManager);
const playWrong = feedbackManager.playWrong.bind(feedbackManager);
const giveFeedback = feedbackManager.giveFeedback.bind(feedbackManager);
const isFootball = pictureRenderer.isFootball.bind(pictureRenderer);
const accessibleWord = pictureRenderer.accessibleWord.bind(pictureRenderer);
const placementPicture = pictureRenderer.placementPicture.bind(pictureRenderer);
const pictureMarkup = pictureRenderer.pictureMarkup.bind(pictureRenderer);
const paintPicture = pictureRenderer.paintPicture.bind(pictureRenderer);
const itemsForTopic = vocabularyRepository.itemsForTopic.bind(vocabularyRepository);
const render = quizGame.render.bind(quizGame);
const choose = quizGame.choose.bind(quizGame);
const renderExplore = exploreGame.renderExplore.bind(exploreGame);
const startMemory = memoryGame.startMemory.bind(memoryGame);
const flipCard = memoryGame.flipCard.bind(memoryGame);
const startScene = sceneGame.startScene.bind(sceneGame);
const renderScene = sceneGame.renderScene.bind(sceneGame);
const chooseScene = sceneGame.chooseScene.bind(sceneGame);
const nextScene = sceneGame.nextScene.bind(sceneGame);
const startPosition = positionGame.startPosition.bind(positionGame);
const renderPosition = positionGame.renderPosition.bind(positionGame);
const positionSpeech = positionGame.positionSpeech.bind(positionGame);
const choosePosition = positionGame.choosePosition.bind(positionGame);
const nextPosition = positionGame.nextPosition.bind(positionGame);
const placementSpeech = placementGame.placementSpeech.bind(placementGame);
const startPlacement = placementGame.startPlacement.bind(placementGame);
const renderPlacement = placementGame.renderPlacement.bind(placementGame);
const targetAt = placementGame.targetAt.bind(placementGame);
const selectPlacement = placementGame.selectPlacement.bind(placementGame);
const placeSelected = placementGame.placeSelected.bind(placementGame);
const nextPlacement = placementGame.nextPlacement.bind(placementGame);
const cancelAdvance = application.cancelAdvance.bind(application);
const scheduleAdvance = application.scheduleAdvance.bind(application);
const showWord = application.showWord.bind(application);
const currentTaskSpeech = application.currentTaskSpeech.bind(application);
const playInstructions = application.playInstructions.bind(application);
const display = application.display.bind(application);
const topicsUI = application.topicsUI.bind(application);
const start = application.start.bind(application);
const next = application.next.bind(application);
const startPositionFromHome = application.startPositionFromHome.bind(application);
const setDifficulty = application.setDifficulty.bind(application);
const finishGame = application.finishGame.bind(application);
const showRhymes = application.showRhymes.bind(application);

// Každá odpověď je obrázek. Dítě nemusí číst.
const topics=[
{title:"BARVY",icon:"🎨",items:[["rot","🔴"],["blau","🔵"],["gelb","🟡"],["grün","🟢"],["schwarz","⚫"],["weiß","⚪"],["braun","🟤"]]},
{title:"POČASÍ",icon:"🌦️",items:[["die Sonne","☀️"],["der Regen","🌧️"],["der Regenbogen","🌈"],["die Wolke","☁️"],["der Schnee","❄️"],["der Wind","💨"]]},
{title:"PODZIM",icon:"🍂",items:[["das Blatt","🍁"],["der Baum","🌳"],["die Kastanie","🌰"],["der Pilz","🍄"],["der Drachen","🪁"],["der Igel","🦔"]]},
{title:"OVOCE",icon:"🍎",items:[["der Apfel","🍎"],["die Birne","🍐"],["die Trauben","🍇"],["die Kirsche","🍒"],["die Orange","🍊"],["die Banane","🍌"]]},
{title:"JÍDLO",icon:"🥨",items:[["das Brot","🍞"],["die Milch","🥛"],["das Ei","🥚"],["der Käse","🧀"],["der Kuchen","🍰"],["die Pizza","🍕"],["die Schokolade","🍫"]]},
{title:"ZVÍŘÁTKA",icon:"🦋",items:[["der Schmetterling","🦋"],["der Marienkäfer","🐞"],["die Raupe","🐛"],["die Ameise","🐜"],["der Igel","🦔"],["die Biene","🐝"]]},
{title:"LIDÉ",icon:"👋",items:[["das Mädchen","👧"],["der Junge","👦"],["die Frau","👩"],["der Mann","👨"],["das Baby","👶"],["die Oma","👵"]]},
{title:"VĚTY A POZDRAVY",icon:"👋",items:[["Guten Morgen!","🌅"],["Wer bist du?","❓"],["Ich bin Dino.","🦕"],["Ich mag das.","❤️"],["Ich mag das nicht.","🙅"],["Es regnet.","🌧️"],["Was ist das?","👀"],["Gute Nacht!","🌙"]]},
{title:"VĚCI KOLEM NÁS",icon:"🧸",items:[["der Regenschirm","☂️"],["der Schuh","👟"],["der Hut","🎩"],["das Buch","📖"],["der Fußball","⚽"],["das Haus","🏠"]]}
];

// Obtížnost 2: jednoduchá slovní spojení a krátké věty; pořadí odpovídá tématům výše.
const levelTwoItems=[
 [["das rote Blatt","🍁🔴"],["die bunten Blätter","🍁🍂"],["die braune Kastanie","🌰🟤"],["der schwarze Hut","🎩⚫"],["der Fußball","⚽"],["der grüne Baum","🌳🟢"],["der blaue Schirm","☂️🔵"]],
 [["Die Sonne scheint.","☀️✨"],["Es regnet stark.","🌧️💦"],["Der Wind weht.","💨🍃"],["Es schneit.","❄️🌨️"],["Der Himmel ist blau.","🌤️🔵"],["Die Wolken ziehen.","☁️💨"]],
 [["die bunten Blätter","🍁🍂"],["die braune Kastanie","🌰🟤"],["der große Baum","🌳⬆️"],["der kleine Igel","🦔🐾"],["der rote Pilz","🍄🔴"],["der bunte Drachen","🪁🌈"]],
 [["der rote Apfel","🍎🔴"],["die gelbe Banane","🍌🟡"],["die grüne Birne","🍐🟢"],["die roten Kirschen","🍒🔴"],["die süße Orange","🍊😋"],["die blauen Trauben","🍇🔵"]],
 [["das frische Brot","🍞✨"],["die kalte Milch","🥛❄️"],["das gekochte Ei","🥚🍲"],["der gelbe Käse","🧀🟡"],["der süße Kuchen","🍰😋"],["die heiße Pizza","🍕♨️"]],
 [["der bunte Schmetterling","🦋🌈"],["die kleine Biene","🐝🐾"],["der rote Marienkäfer","🐞"],["die lange Raupe","🐛📏"],["die fleißige Ameise","🐜💪"],["der kleine Igel","🦔🐾"]],
 [["das kleine Mädchen","👧🐣"],["der große Junge","👦⬆️"],["die nette Oma","👵❤️"],["das kleine Baby","👶🐣"],["der fröhliche Mann","👨😄"],["die glückliche Frau","👩😊"]],
 [["Guten Morgen, Dino!","🌅🦕"],["Ich bin glücklich.","😊❤️"],["Ich habe Hunger.","😋🍽️"],["Ich bin müde.","🥱🌙"],["Ich mag Äpfel.","❤️🍎"],["Die Sonne scheint.","☀️✨"]],
 [["der schwarze Hut","🎩⚫"],["der Fußball","⚽"],["das blaue Buch","📘🔵"],["der gelbe Regenschirm","☂️🟡"],["das große Haus","🏠⬆️"],["die grünen Schuhe","👟🟢"]]
];
topics[0].items.push(...colors.filter(c=>!topics[0].items.some(w=>w[0]===c.de)).map(tuple));
topics.push(...newTopics);
levelTwoItems.push(...newLevelTwo);
const el=id=>document.getElementById(id);
function shuffled(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

const gameInstructions={
 placement:"Poslouchej a přesuň správný obrázek na správné místo.",
 quiz:"Poslouchej německé slovíčko a klepni na správný obrázek.",
 explore:"Klepni na obrázek a poslouchej, jak se řekne německy.",
 memory:"Otoč dvě kartičky a najdi stejný obrázek.",
 scene:"Poslouchej a najdi správný obrázek ve scéně.",
 position:"Poslouchej a ukaž, kde je obrázek. Nahoře, dole, vlevo, vpravo nebo uprostřed."
};

const feedbackMessages={
 correct:[{feedback:"Super!",label:"SUPER!"},{feedback:"Sehr gut!",label:"VÝBORNĚ!"},{feedback:"Prima gemacht!",label:"SKVĚLÁ PRÁCE!"},{feedback:"Richtig!",label:"SPRÁVNĚ!"}],
 wrong:[{feedback:"Noch mal!",label:"ZKUS TO ZNOVU!"},{feedback:"Nicht ganz!",label:"TO JEŠTĚ NENÍ ONO!"}]
};

const sceneLayouts=[
 {theme:"colors",spots:[[28,30],[55,24],[43,54],[80,75],[19,77],[66,58],[53,83]]},
 {theme:"garden",spots:[[33,27],[55,22],[44,49],[24,72],[70,76],[59,57],[85,35]]},
 {theme:"autumn",spots:[[30,28],[63,20],[23,53],[71,59],[40,79],[81,80],[51,58]]},
 {theme:"garden",spots:[[31,29],[57,22],[44,52],[27,73],[71,76],[82,54],[52,84]]},
 {theme:"kitchen",spots:[[36,22],[59,24],[20,47],[47,49],[77,49],[32,78],[62,78]]},
 {theme:"garden",spots:[[39,25],[64,26],[23,58],[52,52],[78,58],[38,81],[65,82]]},
 {theme:"people",spots:[[25,31],[50,26],[76,31],[21,62],[52,55],[78,64],[45,84]]},
 {theme:"garden",spots:[[30,29],[57,23],[42,52],[24,74],[72,77],[83,57],[55,83]]},
 {theme:"people",spots:[[33,27],[63,24],[21,52],[48,51],[76,53],[32,77],[66,79]]}
];

const positionDirections=[
 {id:"oben",label:"NAHOŘE"},{id:"links",label:"VLEVO"},{id:"mitte",label:"UPROSTŘED"},{id:"rechts",label:"VPRAVO"},{id:"unten",label:"DOLE"}
];
const positionObjects=[
 {icon:"🍎",name:"APFEL"},{icon:"🎩",name:"HUT"},{icon:"🐱",name:"KATZE"},{icon:"🌞",name:"SONNE"},{icon:"🌳",name:"BAUM"},
 {icon:"🍄",name:"PILZ"},{icon:"🦋",name:"SCHMETTERLING"},{icon:"📘",name:"BUCH"},{icon:"🧸",name:"TEDDY"},{icon:"🌰",name:"KASTANIE"}
];
const positionQuestions=[
 {dir:"oben",object:0,speech:"Der Apfel ist oben.",sentence:"Der rote Apfel ist oben."},
 {dir:"unten",object:1,speech:"Der Hut ist unten.",sentence:"Der schwarze Hut ist unten."},
 {dir:"links",object:2,speech:"Die Katze ist links.",sentence:"Die kleine Katze ist links."},
 {dir:"rechts",object:3,speech:"Die Sonne ist rechts.",sentence:"Die gelbe Sonne ist rechts."},
 {dir:"mitte",object:4,speech:"Der Baum ist in der Mitte.",sentence:"Der grüne Baum ist in der Mitte."},
 {dir:"unten",object:5,speech:"Der Pilz ist unten.",sentence:"Der rote Pilz ist unten."},
 {dir:"oben",object:6,speech:"Der Schmetterling ist oben.",sentence:"Der bunte Schmetterling ist oben."},
 {dir:"mitte",object:7,speech:"Das Buch ist in der Mitte.",sentence:"Das blaue Buch ist in der Mitte."},
 {dir:"rechts",object:8,speech:"Der Teddy ist rechts.",sentence:"Der kleine Teddy ist rechts."},
 {dir:"links",object:9,speech:"Die Kastanie ist links.",sentence:"Die braune Kastanie ist links."}
];

// Placement is intentionally a separate mode: four objects, five spatial targets.
const placementObjects=[
 {icon:"🍎",noun:"Apfel",article:"den",adjective:"roten"},
 {icon:"🎩",noun:"Hut",article:"den",adjective:"schwarzen"},
 {icon:"🦋",noun:"Schmetterling",article:"den",adjective:"bunten"},
 {icon:"🍄",noun:"Pilz",article:"den",adjective:"roten"},
 {icon:"⚽",noun:"Fußball",article:"den",adjective:"schwarz-weißen"},
 {icon:"📘",noun:"Buch",article:"das",adjective:"blaue"},
 {icon:"🐱",noun:"Katze",article:"die",adjective:"kleine"},
 {icon:"🌳",noun:"Baum",article:"den",adjective:"grünen"}
];
const placementPhrases={oben:"nach oben",unten:"nach unten",links:"nach links",rechts:"nach rechts",mitte:"in die Mitte"};

Object.assign(context,{audioManager,feedbackManager,pictureRenderer,vocabularyRepository,quizGame,exploreGame,memoryGame,sceneGame,positionGame,placementGame,application,stopAudio,audioFile,speak,playErrorTone,clearWrongHighlight,markWrongHighlight,playWrong,giveFeedback,isFootball,accessibleWord,placementPicture,pictureMarkup,paintPicture,itemsForTopic,render,choose,renderExplore,startMemory,flipCard,startScene,renderScene,chooseScene,nextScene,startPosition,renderPosition,positionSpeech,choosePosition,nextPosition,placementSpeech,startPlacement,renderPlacement,targetAt,selectPlacement,placeSelected,nextPlacement,cancelAdvance,scheduleAdvance,showWord,currentTaskSpeech,playInstructions,display,topicsUI,start,next,startPositionFromHome,setDifficulty,finishGame,showRhymes,topics,levelTwoItems,el,shuffled,gameInstructions,feedbackMessages,sceneLayouts,positionDirections,positionObjects,positionQuestions,placementObjects,placementPhrases,numberSentences,state});
Object.defineProperty(context,'rhymes',{get:()=>rhymes});
const rhymes=[
 {icon:"🌈",title:"REGENBOGEN",lines:["REGEN, REGEN, KOMM HERBEI,","SONNE SCHEINT, DER HIMMEL FREI.","ROT UND GELB UND GRÜN UND BLAU,","EIN REGENBOGEN – SCHAU, SCHAU, SCHAU!"],speech:"Regen, Regen, komm herbei. Sonne scheint, der Himmel frei. Rot und gelb und grün und blau. Ein Regenbogen, schau, schau, schau!"},
 {icon:"🍂",title:"BUNTE BLÄTTER",lines:["BUNTE BLÄTTER, ROT UND GELB,","FLIEGEN LEISE DURCH DIE WELT.","EINS, ZWEI, DREI – SCHAU MAL HER,","DER WIND BLÄST SIE HIN UND HER!"],speech:"Bunte Blätter, rot und gelb. Fliegen leise durch die Welt. Eins, zwei, drei, schau mal her. Der Wind bläst sie hin und her!"},
 {icon:"☔",title:"REGENSCHIRM",lines:["ES REGNET, ES REGNET,","ICH NEHME MEINEN SCHIRM.","ICH NEHME MEINE GUMMISTIEFEL,","UND SPRINGE IN DIE PFÜTZEN!"],speech:"Es regnet, es regnet. Ich nehme meinen Schirm. Ich nehme meine Gummistiefel. Und springe in die Pfützen!"},
 {icon:"👋",title:"GUTEN MORGEN",lines:["GUTEN MORGEN!","WIE GEHT ES DIR?","MIR GEHT ES GUT!","UND WIE GEHT ES DIR?"],speech:"Guten Morgen! Wie geht es dir? Mir geht es gut! Und wie geht es dir?"}
];

rhymes.push(...newRhymes);
function bindControls() {
  loadInterfaceArt();
  el("positionStart").addEventListener("click", startPositionFromHome);
  el("instructions").addEventListener("click", playInstructions);
  for (const level of [1, 2]) el("level" + level).addEventListener("click", () => setDifficulty(level));
  const modes = document.querySelectorAll(".mode");
  for (const button of modes) {
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode;
      stopAudio();
      playInstructions();
      const spatial = ["position", "placement"].includes(state.mode);
      el("positionStart").classList.toggle("hide", !spatial);
      el("positionStart").textContent = state.mode === "placement" ? "ZAČÍT HRU – KAM TO PATŘÍ?" : "ZAČÍT HRU – KDE JE CO?";
      el("lessonPanel").classList.toggle("hide", spatial);
      for (const other of modes) {
        other.classList.toggle("active", other === button);
        other.setAttribute("aria-pressed", String(other === button));
      }
    });
  }
  el("listen").addEventListener("click", () => {
    clearTimeout(state.wrongAnswerWatchdog);
    state.wrongAnswerWatchdog = null;
    state.audioBusy = false;
    placementGame.placementLocked = false;
    el("message").textContent = "";
    speak(currentTaskSpeech(), {onEnd: clearWrongHighlight});
  });
  el("next").addEventListener("click", next);
  for (const id of ["back", "all", "rhymeBack"]) el(id).addEventListener("click", () => display("home"));
  el("retry").addEventListener("click", () => start(state.topicIndex));
  el("rhymesButton").addEventListener("click", showRhymes);
  topicsUI();
}

if (typeof document !== "undefined") bindControls();

export { vocabulary, numberSentences, audioManager, feedbackManager, pictureRenderer, vocabularyRepository, quizGame, exploreGame, memoryGame, sceneGame, positionGame, placementGame, application, stopAudio, audioFile, speak, playErrorTone, clearWrongHighlight, markWrongHighlight, playWrong, giveFeedback,  isFootball, accessibleWord, placementPicture, pictureMarkup, paintPicture, itemsForTopic, render, choose, renderExplore, startMemory, flipCard, startScene, renderScene, chooseScene, nextScene, startPosition, renderPosition, positionSpeech, choosePosition, nextPosition, placementSpeech, startPlacement, renderPlacement, targetAt, selectPlacement, placeSelected, nextPlacement, cancelAdvance, scheduleAdvance, showWord, currentTaskSpeech, playInstructions, display, topicsUI, start, next, startPositionFromHome, setDifficulty, finishGame, showRhymes, topics, levelTwoItems, el, shuffled, gameInstructions, feedbackMessages, sceneLayouts, positionDirections, positionObjects, positionQuestions, placementObjects, placementPhrases, rhymes };

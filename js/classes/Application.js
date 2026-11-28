
export class Application {
constructor(context){this.context=context;}


cancelAdvance(){
const { audioManager, memoryGame, sceneGame, placementGame, stopAudio, speak, clearWrongHighlight, itemsForTopic, render, renderExplore, startMemory, startScene, nextScene, startPosition, positionSpeech, nextPosition, placementSpeech, startPlacement, nextPlacement, cancelAdvance, scheduleAdvance, showWord, currentTaskSpeech, playInstructions, display, topicsUI, start, next, startPositionFromHome, setDifficulty, finishGame, showRhymes, topics, el, shuffled, gameInstructions, rhymes, state } = this.context;
if(state.advanceTimer!==null){clearTimeout(state.advanceTimer);state.advanceTimer=null}}
scheduleAdvance(){
const { audioManager, memoryGame, sceneGame, placementGame, stopAudio, speak, clearWrongHighlight, itemsForTopic, render, renderExplore, startMemory, startScene, nextScene, startPosition, positionSpeech, nextPosition, placementSpeech, startPlacement, nextPlacement, cancelAdvance, scheduleAdvance, showWord, currentTaskSpeech, playInstructions, display, topicsUI, start, next, startPositionFromHome, setDifficulty, finishGame, showRhymes, topics, el, shuffled, gameInstructions, rhymes, state } = this.context;
cancelAdvance();state.advanceTimer=setTimeout(()=>{state.advanceTimer=null;if(!el("game").classList.contains("hide"))next()},3000)}
showWord(word){
const { audioManager, memoryGame, sceneGame, placementGame, stopAudio, speak, clearWrongHighlight, itemsForTopic, render, renderExplore, startMemory, startScene, nextScene, startPosition, positionSpeech, nextPosition, placementSpeech, startPlacement, nextPlacement, cancelAdvance, scheduleAdvance, showWord, currentTaskSpeech, playInstructions, display, topicsUI, start, next, startPositionFromHome, setDifficulty, finishGame, showRhymes, topics, el, shuffled, gameInstructions, rhymes, state } = this.context;
if(el("game").classList.contains("hide"))return;el("spokenWords").textContent=word.toLocaleUpperCase("de-DE");el("spokenText").classList.remove("hide")}
currentTaskSpeech(){
const { audioManager, memoryGame, sceneGame, placementGame, stopAudio, speak, clearWrongHighlight, itemsForTopic, render, renderExplore, startMemory, startScene, nextScene, startPosition, positionSpeech, nextPosition, placementSpeech, startPlacement, nextPlacement, cancelAdvance, scheduleAdvance, showWord, currentTaskSpeech, playInstructions, display, topicsUI, start, next, startPositionFromHome, setDifficulty, finishGame, showRhymes, topics, el, shuffled, gameInstructions, rhymes, state } = this.context;

 if(state.mode==="placement")return placementSpeech();
 if(state.mode==="position")return positionSpeech();
 if(state.mode==="scene")return sceneGame.sceneItems[sceneGame.sceneStep]?.[0]||"";
 if(state.mode==="quiz")return state.round[state.step]?.[0]||"";
 return "";
}
playInstructions(){
const { audioManager, memoryGame, sceneGame, placementGame, stopAudio, speak, clearWrongHighlight, itemsForTopic, render, renderExplore, startMemory, startScene, nextScene, startPosition, positionSpeech, nextPosition, placementSpeech, startPlacement, nextPlacement, cancelAdvance, scheduleAdvance, showWord, currentTaskSpeech, playInstructions, display, topicsUI, start, next, startPositionFromHome, setDifficulty, finishGame, showRhymes, topics, el, shuffled, gameInstructions, rhymes, state } = this.context;
speak(gameInstructions[state.mode],{once:true,showWord:false})}
display(id){
const { audioManager, memoryGame, sceneGame, placementGame, stopAudio, speak, clearWrongHighlight, itemsForTopic, render, renderExplore, startMemory, startScene, nextScene, startPosition, positionSpeech, nextPosition, placementSpeech, startPlacement, nextPlacement, cancelAdvance, scheduleAdvance, showWord, currentTaskSpeech, playInstructions, display, topicsUI, start, next, startPositionFromHome, setDifficulty, finishGame, showRhymes, topics, el, shuffled, gameInstructions, rhymes, state } = this.context;
for(const game of [this.context.quizGame,this.context.exploreGame,this.context.memoryGame,this.context.sceneGame,this.context.positionGame,this.context.placementGame])game.destroy();clearWrongHighlight();cancelAdvance();clearTimeout(state.wrongAnswerWatchdog);state.wrongAnswerWatchdog=null;stopAudio();state.audioBusy=false;placementGame.placementLocked=false;if(id!=="game")el("spokenText").classList.add("hide");for(const name of ["home","game","finish","rhymes"])el(name).classList.toggle("hide",name!==id);if(id!=="game"){el("positionBoard").classList.add("hide");el("placementArea").classList.add("hide")}}
topicsUI(){
const { audioManager, memoryGame, sceneGame, placementGame, stopAudio, speak, clearWrongHighlight, itemsForTopic, render, renderExplore, startMemory, startScene, nextScene, startPosition, positionSpeech, nextPosition, placementSpeech, startPlacement, nextPlacement, cancelAdvance, scheduleAdvance, showWord, currentTaskSpeech, playInstructions, display, topicsUI, start, next, startPositionFromHome, setDifficulty, finishGame, showRhymes, topics, el, shuffled, gameInstructions, rhymes, state } = this.context;
const area=el("topics");area.replaceChildren();topics.forEach((t,i)=>{const b=document.createElement("button");b.className="topic";const pic=document.createElement("span");pic.className="picture";const previews=[['rot','color:rot'],['die Sonne','☀️'],['die bunten Blätter','🍂'],['der Apfel','🍎'],['der Kuchen','🍰'],['der Schmetterling','🦋'],['das Mädchen','👧'],['Ich bin Dino.','🦕'],['der Fußball','⚽'],['drei','number:3'],['malen','activity:malen'],['der Feuerwehrmann','👨‍🚒']];this.context.paintPicture(pic,previews[i]||t.items[0]);const label=document.createElement("span");label.textContent=t.title;b.append(pic,label);b.addEventListener("click",()=>start(i));area.appendChild(b)})}
start(i){
const { audioManager, memoryGame, sceneGame, placementGame, stopAudio, speak, clearWrongHighlight, itemsForTopic, render, renderExplore, startMemory, startScene, nextScene, startPosition, positionSpeech, nextPosition, placementSpeech, startPlacement, nextPlacement, cancelAdvance, scheduleAdvance, showWord, currentTaskSpeech, playInstructions, display, topicsUI, start, next, startPositionFromHome, setDifficulty, finishGame, showRhymes, topics, el, shuffled, gameInstructions, rhymes, state } = this.context;
clearWrongHighlight();cancelAdvance();stopAudio();state.audioBusy=false;state.topicIndex=i;state.reset(shuffled(itemsForTopic(i)).slice(0,6));display("game");if(state.mode==="position")startPosition();else if(state.mode==="placement")startPlacement();else if(state.mode==="memory")startMemory();else if(state.mode==="explore")renderExplore();else if(state.mode==="scene")startScene();else{render();speak(state.round[state.step][0])}}
next(){
const { audioManager, memoryGame, sceneGame, placementGame, stopAudio, speak, clearWrongHighlight, itemsForTopic, render, renderExplore, startMemory, startScene, nextScene, startPosition, positionSpeech, nextPosition, placementSpeech, startPlacement, nextPlacement, cancelAdvance, scheduleAdvance, showWord, currentTaskSpeech, playInstructions, display, topicsUI, start, next, startPositionFromHome, setDifficulty, finishGame, showRhymes, topics, el, shuffled, gameInstructions, rhymes, state } = this.context;
clearWrongHighlight();cancelAdvance();stopAudio();state.audioBusy=false;if(state.mode==="placement"){nextPlacement();return}if(state.mode==="position"){nextPosition();return}if(state.mode==="scene"){nextScene();return}if(state.mode==="memory"){state.score=memoryGame.pairsFound;finishGame(4);return}state.step++;if(state.step<state.round.length){render();speak(state.round[state.step][0]);return}el("bar").style.width="100%";try{const key="nemcina-hrou-"+state.difficulty+"-"+state.topicIndex;localStorage.setItem(key,String(Math.max(state.score,Number(localStorage.getItem(key)||0))))}catch(e){}el("result").textContent="⭐ "+state.score+" / "+state.round.length;display("finish");speak("Sehr gut!")}
startPositionFromHome(){
const { audioManager, memoryGame, sceneGame, placementGame, stopAudio, speak, clearWrongHighlight, itemsForTopic, render, renderExplore, startMemory, startScene, nextScene, startPosition, positionSpeech, nextPosition, placementSpeech, startPlacement, nextPlacement, cancelAdvance, scheduleAdvance, showWord, currentTaskSpeech, playInstructions, display, topicsUI, start, next, startPositionFromHome, setDifficulty, finishGame, showRhymes, topics, el, shuffled, gameInstructions, rhymes, state } = this.context;
stopAudio();display("game");if(state.mode==="placement")startPlacement();else startPosition()}
setDifficulty(value){
const { audioManager, memoryGame, sceneGame, placementGame, stopAudio, speak, clearWrongHighlight, itemsForTopic, render, renderExplore, startMemory, startScene, nextScene, startPosition, positionSpeech, nextPosition, placementSpeech, startPlacement, nextPlacement, cancelAdvance, scheduleAdvance, showWord, currentTaskSpeech, playInstructions, display, topicsUI, start, next, startPositionFromHome, setDifficulty, finishGame, showRhymes, topics, el, shuffled, gameInstructions, rhymes, state } = this.context;
state.difficulty=value;stopAudio();for(const n of [1,2]){const button=el("level"+n);button.classList.toggle("active",n===value);button.setAttribute("aria-pressed",String(n===value))}el("levelHelp").textContent=value===1?"JEDNODUCHÁ SLOVÍČKA A OBRÁZKY":"BAREVNÉ LISTY, ČERNÝ KLOBOUK, SLUNCE SVÍTÍ A DALŠÍ VĚTY"}
finishGame(total){
const { audioManager, memoryGame, sceneGame, placementGame, stopAudio, speak, clearWrongHighlight, itemsForTopic, render, renderExplore, startMemory, startScene, nextScene, startPosition, positionSpeech, nextPosition, placementSpeech, startPlacement, nextPlacement, cancelAdvance, scheduleAdvance, showWord, currentTaskSpeech, playInstructions, display, topicsUI, start, next, startPositionFromHome, setDifficulty, finishGame, showRhymes, topics, el, shuffled, gameInstructions, rhymes, state } = this.context;
el("result").textContent="⭐ "+state.score+" / "+total;display("finish");speak("Sehr gut!")}
showRhymes(){
const { audioManager, memoryGame, sceneGame, placementGame, stopAudio, speak, clearWrongHighlight, itemsForTopic, render, renderExplore, startMemory, startScene, nextScene, startPosition, positionSpeech, nextPosition, placementSpeech, startPlacement, nextPlacement, cancelAdvance, scheduleAdvance, showWord, currentTaskSpeech, playInstructions, display, topicsUI, start, next, startPositionFromHome, setDifficulty, finishGame, showRhymes, topics, el, shuffled, gameInstructions, rhymes, state } = this.context;

 stopAudio();display("rhymes");const area=el("rhymeList");area.replaceChildren();
 rhymes.forEach(r=>{
  const card=document.createElement("div");card.className="rhymeCard";const icon=document.createElement("span");icon.className="emoji";const previews=[['der Regenbogen','🌈'],['die bunten Blätter','🍂'],['der Regenschirm','☂️'],['Guten Morgen!','🌅'],['zehn','number:10'],['zwölf','number:12'],['malen','activity:malen']];this.context.paintPicture(icon,previews[rhymes.indexOf(r)]||['Ich bin Dino.','🦕']);
  const title=document.createElement("h2");title.textContent=r.title;card.append(icon,title);
  const lineButtons=r.lines.map((line,i)=>{const b=document.createElement("button");b.className="rhymeLine";b.textContent="🔊 "+line;b.addEventListener("click",()=>playLine(i));card.appendChild(b);return b});
  function highlight(i){lineButtons.forEach((b,j)=>b.classList.toggle("active",i===j))}
  function playLine(i){highlight(i);speak(r.lines[i])}
  const tools=document.createElement("div");tools.className="rhymeTools";
  const full=document.createElement("button");full.textContent="▶️ CELÁ ŘÍKANKA";full.addEventListener("click",()=>{highlight(-1);speak(r.speech)});
  const lineStep=document.createElement("button");lineStep.textContent="🎵 PO ŘÁDCÍCH";lineStep.addEventListener("click",()=>{
   function playIndex(i){if(i>=r.lines.length){highlight(-1);return}highlight(i);speak(r.lines[i],{once:true,onEnd:()=>{audioManager.repeatTimer=setTimeout(()=>playIndex(i+1),900)}})}
   playIndex(0)
  });
  tools.append(full,lineStep);card.appendChild(tools);area.appendChild(card)
 })
}
}


"use strict";
class BaseGame {}
class AudioManager {
audioPlayer=null;
repeatTimer=null;
playbackToken=0;
stopAudio(){audioManager.playbackToken++;if(audioManager.repeatTimer){clearTimeout(audioManager.repeatTimer);audioManager.repeatTimer=null}if(audioManager.audioPlayer){audioManager.audioPlayer.pause();audioManager.audioPlayer.onended=null;audioManager.audioPlayer=null}}
audioFile(word){return "audio/"+encodeURIComponent(word).replace(/[!'()*]/g,c=>"%"+c.charCodeAt(0).toString(16).toUpperCase()).replace(/%/g,"_")+".mp3"}
speak(word,options={}){
 stopAudio();const token=audioManager.playbackToken;
 if(options.showWord!==false)showWord(word);
 let completed=false;const finish=()=>{if(completed||token!==audioManager.playbackToken)return;completed=true;if(options.onEnd)options.onEnd()};
 if(!el("voice").checked){finish();return}
 const speed=el("slow").checked?0.78:1,twice=el("repeat").checked&&!options.once;
 function playOnce(remaining){
  if(token!==audioManager.playbackToken)return;
  const player=new Audio(audioFile(word));audioManager.audioPlayer=player;player.playbackRate=options.quick?Math.min(1.2,speed*1.15):speed;player.preservesPitch=true;
  player.onended=()=>{if(token!==audioManager.playbackToken)return;if(remaining>1){audioManager.repeatTimer=setTimeout(()=>playOnce(remaining-1),350)}else finish()};
  player.onerror=()=>{if(token===audioManager.playbackToken){el("message").textContent="🔇 ZVUK NENÍ DOSTUPNÝ";finish()}};
  try{const promise=player.play();if(promise&&promise.catch)promise.catch(()=>{if(token===audioManager.playbackToken){el("message").textContent="🔇 KLEPNI NA 🔊";finish()}})}catch(e){finish()}
 }
 playOnce(twice?2:1);
}
playErrorTone(onEnd){
 // Reliable single short chime; do not block speech if Web Audio is unavailable.
 const token=audioManager.playbackToken;
 let completed=false;
 const finish=()=>{if(completed)return;completed=true;if(token===audioManager.playbackToken)onEnd()};
 if(!el("voice").checked){finish();return}
 try{
  const Context=window.AudioContext||window.webkitAudioContext;
  if(!Context){finish();return}
  if(!feedbackManager.errorToneContext)feedbackManager.errorToneContext=new Context();
  const ctx=feedbackManager.errorToneContext;
  if(ctx.state==="suspended")ctx.resume().catch(()=>{});
  const start=ctx.currentTime+0.01;
  const oscillator=ctx.createOscillator(),gain=ctx.createGain();
  oscillator.type="triangle";
  oscillator.frequency.setValueAtTime(440,start);
  oscillator.frequency.exponentialRampToValueAtTime(300,start+0.16);
  gain.gain.setValueAtTime(0.0001,start);
  gain.gain.exponentialRampToValueAtTime(0.10,start+0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001,start+0.18);
  oscillator.connect(gain);gain.connect(ctx.destination);
  oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();finish()};
  oscillator.start(start);oscillator.stop(start+0.19);
  // Safari can fail to fire onended while audio context is suspended.
  setTimeout(finish,280);
 }catch(e){finish()}
}
}
const audioManager = new AudioManager();
class FeedbackManager {
errorToneContext=null;
activeWrongHighlight=null;
clearWrongHighlight(){if(feedbackManager.activeWrongHighlight){feedbackManager.activeWrongHighlight.classList.remove("wrong");feedbackManager.activeWrongHighlight=null}}
markWrongHighlight(element){clearWrongHighlight();if(element){element.classList.add("wrong");feedbackManager.activeWrongHighlight=element}}
playWrong(word,options={}){
 // Tone -> selected answer -> original German error feedback -> original task.
 // A new answer can interrupt the sequence immediately.
 stopAudio();audioBusy=false;
 let sequenceToken=audioManager.playbackToken;
 const task=currentTaskSpeech();
 if(options.highlight)markWrongHighlight(options.highlight);
 const wrongChoices=feedbackMessages.wrong;
 let index=Math.floor(Math.random()*wrongChoices.length);
 if(wrongChoices.length>1&&index===previousFeedback.wrong)index=(index+1)%wrongChoices.length;
 previousFeedback.wrong=index;
 const feedback=wrongChoices[index];
 const active=()=>sequenceToken===audioManager.playbackToken&&!el("game").classList.contains("hide");
 el("message").textContent=feedback.label;
 const replayTask=()=>{
  if(!active())return;
  clearWrongHighlight();
  if(task&&mode!=="memory"){showWord(task);speak(task,{once:true,quick:true});sequenceToken=audioManager.playbackToken}
  else if(word)showWord(word);
 };
 const playFeedback=()=>{
  if(!active())return;
  el("message").textContent=feedback.label;
  speak(feedback.feedback,{once:true,quick:true,showWord:false,onEnd:replayTask});sequenceToken=audioManager.playbackToken;
 };
 const playSelected=()=>{
  if(!active())return;
  if(word){speak(word,{once:true,quick:true,onEnd:playFeedback});sequenceToken=audioManager.playbackToken;}
  else playFeedback();
 };
 playErrorTone(playSelected);
 if(options.onEnd)options.onEnd();
}
giveFeedback(correct,options={}){
 const kind=correct?"correct":"wrong",choices=feedbackMessages[kind];let index=Math.floor(Math.random()*choices.length);
 if(choices.length>1&&index===previousFeedback[kind])index=(index+1+Math.floor(Math.random()*(choices.length-1)))%choices.length;
 previousFeedback[kind]=index;const chosen=choices[index];
 el("message").textContent=chosen.label;speak(chosen.feedback,{once:true,showWord:false,onEnd:options.onEnd});
}
}
const feedbackManager = new FeedbackManager();
class PictureRenderer {

soccerBallMarkup(){
 return '<svg class="learningArt footballArt" viewBox="0 0 100 100" role="img" aria-label="fotbalový míč"><circle cx="50" cy="50" r="36" fill="#fff" stroke="#26313b" stroke-width="2.5"/><path d="M50 32 L67 44 L61 63 L39 63 L33 44Z" fill="#222831"/><path d="M50 32 L44 15 L57 15 L67 44 L82 36 L84 52 L61 63 L68 81 L55 86 L39 63 L21 72 L16 57 L33 44 L22 31 L33 20Z" fill="none" stroke="#222831" stroke-width="3.5"/><path d="M44 15 L33 20 L22 31 L16 57 L21 72 M57 15 L68 20 L82 36 L84 52 L68 81 L55 86" fill="none" stroke="#222831" stroke-width="3"/></svg>';
}
isFootball(word){return /fußball|fussball/i.test(word[0])}
accessibleWord(word){return isFootball(word)?"fotbalový míč – "+word[0]:word[0]}
placementPicture(object){return object.noun==="Fußball"?soccerBallMarkup():object.icon}
pictureMarkup(word){
 const text=word[0].toLocaleLowerCase("de-DE"),emoji=word[1];
 const palette={rote:"#e64545",roten:"#e64545",braune:"#9b6235",schwarze:"#202638",gelbe:"#f2c831",grüne:"#47a963",grünen:"#47a963",blaue:"#3979d9",blauen:"#3979d9",bunten:"#e96736"};
 const color=Object.entries(palette).find(([key])=>text.includes(key))?.[1];
 let shape="";
 if(text.includes("apfel"))shape='<path d="M50 34 C22 11 6 47 20 75 Q34 104 50 88 Q66 104 80 75 C94 47 78 11 50 34Z" fill="'+(color||"#e64545")+'"/><path d="M50 33 Q45 14 56 9" stroke="#67452c" stroke-width="5" fill="none"/><ellipse cx="64" cy="20" rx="14" ry="7" fill="#4da86a" transform="rotate(-27 64 20)"/>';
 else if(text.includes("marienkäfer"))shape='<ellipse cx="50" cy="57" rx="32" ry="30" fill="#e43e3e"/><path d="M50 28 V85" stroke="#1d5231" stroke-width="4"/><circle cx="35" cy="45" r="6" fill="#173c26"/><circle cx="66" cy="45" r="6" fill="#173c26"/><circle cx="37" cy="68" r="6" fill="#173c26"/><circle cx="64" cy="68" r="6" fill="#173c26"/><circle cx="50" cy="25" r="14" fill="#20352a"/><path d="M45 14 Q32 4 28 13 M55 14 Q68 4 72 13" fill="none" stroke="#20352a" stroke-width="3"/>';
 else if(text.includes("hut"))shape='<path d="M28 72 L35 24 Q50 14 65 24 L72 72Z" fill="'+(color||"#242632")+'"/><ellipse cx="50" cy="75" rx="43" ry="11" fill="'+(color||"#242632")+'"/><path d="M30 62 H70" stroke="#d7a853" stroke-width="7"/>';
 else if(text.includes("kastanie"))shape='<ellipse cx="50" cy="55" rx="33" ry="32" fill="'+(color||"#92522e")+'"/><path d="M37 26 Q50 16 63 26" stroke="#e6b67a" stroke-width="5" fill="none"/>';
 else if(text.includes("blatt")||text.includes("blätter"))shape='<path d="M50 10 Q90 30 77 63 Q65 87 50 92 Q25 74 16 53 Q12 30 50 10Z" fill="'+(color||"#df7434")+'"/><path d="M50 91 L50 26 M50 62 L27 44 M50 53 L73 34" stroke="#85502e" stroke-width="3" fill="none"/>';
 else if(text.includes("sonne"))shape='<circle cx="50" cy="50" r="25" fill="#f5c63b"/>'+Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return '<path d="M'+(50+33*Math.cos(a))+' '+(50+33*Math.sin(a))+' L'+(50+44*Math.cos(a))+' '+(50+44*Math.sin(a))+'" stroke="#e9aa27" stroke-width="6" stroke-linecap="round"/>'}).join("");
 else if(text.includes("regnet"))shape='<path d="M24 48 Q18 24 40 27 Q50 8 67 27 Q89 27 80 49Z" fill="#a5b6c7"/><path d="M28 62 L20 81 M50 62 L42 81 M72 62 L64 81" stroke="#3b8de2" stroke-width="7" stroke-linecap="round"/>';
 else if(text.includes("fußball")||text.includes("fussball"))return soccerBallMarkup();
 else if(text.includes("buch"))shape='<path d="M19 17 H73 Q83 17 83 28 V84 H25 Q19 84 19 76Z" fill="'+(color||"#3979d9")+'"/><path d="M26 73 H83" stroke="#fff" stroke-width="5"/>';
 if(!shape)return '<span class="singleEmoji">'+(Array.from(emoji)[0]||"🎨")+'</span>';
 return '<svg class="learningArt" viewBox="0 0 100 100" role="img" aria-label="'+text.replace(/"/g,"")+'">'+shape+'</svg>';
}
paintPicture(button,word){if(isFootball(word))button.innerHTML=soccerBallMarkup();else if(difficulty===2)button.innerHTML=pictureMarkup(word);else button.textContent=word[1]}
}
const pictureRenderer = new PictureRenderer();
class VocabularyRepository {

itemsForTopic(i){return difficulty===2?levelTwoItems[i]:topics[i].items}
}
const vocabularyRepository = new VocabularyRepository();
class QuizGame extends BaseGame {

render(){ audioBusy=false;el("spokenText").classList.add("hide");el("positionBoard").classList.add("hide");el("placementArea").classList.add("hide");el("sceneCanvas").classList.add("hide");el("choices").classList.remove("hide");el("choices").className="choices"+(difficulty===2?" level2":"");el("listen").classList.remove("hide");done=false;const t=topics[topicIndex],correct=round[step];el("heading").textContent=t.icon+" "+t.title;el("count").textContent=(step+1)+" / "+round.length;el("stars").textContent="⭐ "+score;el("bar").style.width=(step/round.length*100)+"%";el("message").textContent="";el("next").classList.add("hide");const area=el("choices");area.replaceChildren();const options=shuffled([correct,...shuffled(itemsForTopic(topicIndex).filter(w=>w!==correct)).slice(0,3)]);options.forEach(w=>{const b=document.createElement("button");b.className="choice";paintPicture(b,w);b.setAttribute("aria-label","OBRÁZEK "+accessibleWord(w));b.addEventListener("click",()=>choose(b,w===correct,correct,w));area.appendChild(b)});}
choose(button,right,correct,selected){if(done||audioBusy)return;if(right){done=true;for(const b of el("choices").children)b.disabled=true;}if(right){score++;button.classList.add("correct");giveFeedback(true);scheduleAdvance()}else{playWrong(selected[0],{highlight:button})}el("stars").textContent="⭐ "+score;el("next").textContent=step===round.length-1?"🏆 VÝSLEDEK":"➡️ DÁL";if(right)el("next").classList.remove("hide")}
}
const quizGame = new QuizGame();
class ExploreGame extends BaseGame {

renderExplore(){ audioBusy=false;el("spokenText").classList.add("hide");el("positionBoard").classList.add("hide");el("sceneCanvas").classList.add("hide");el("choices").classList.remove("hide");
 const t=topics[topicIndex];el("heading").textContent=t.icon+" "+t.title;el("count").textContent="🔊";el("stars").textContent="⭐";el("bar").style.width="100%";el("listen").classList.add("hide");el("next").classList.add("hide");el("message").textContent="👆 KLEPNI NA OBRÁZEK";const area=el("choices");area.className="choices explore"+(difficulty===2?" level2":"");area.replaceChildren();
 itemsForTopic(topicIndex).forEach(w=>{const b=document.createElement("button");b.className="choice";paintPicture(b,w);b.setAttribute("aria-label","PŘEHRÁT "+accessibleWord(w));b.addEventListener("click",()=>{for(const c of area.children)c.classList.remove("correct");b.classList.add("correct");speak(w[0])});area.appendChild(b)})
}
}
const exploreGame = new ExploreGame();
class MemoryGame extends BaseGame {
memoryCards=[];
firstCard=null;
lockMemory=false;
pairsFound=0;
startMemory(){ audioBusy=false;el("spokenText").classList.add("hide");el("positionBoard").classList.add("hide");el("sceneCanvas").classList.add("hide");el("choices").classList.remove("hide");
 const selected=shuffled(itemsForTopic(topicIndex)).slice(0,4);
 memoryGame.memoryCards=shuffled(selected.flatMap((w,i)=>[{word:w,id:i},{word:w,id:i}]));
 memoryGame.firstCard=null;memoryGame.lockMemory=false;memoryGame.pairsFound=0;
 el("heading").textContent="🃏 PEXESO";el("count").textContent="0 / 4";el("stars").textContent="⭐ 0";el("bar").style.width="0%";el("listen").classList.add("hide");el("next").classList.add("hide");el("message").textContent="🃏 NAJDI DVOJICE";
 const area=el("choices");area.className="choices memory"+(difficulty===2?" level2":"");area.replaceChildren();
 memoryGame.memoryCards.forEach((card,i)=>{const b=document.createElement("button");b.className="choice faceDown";b.textContent="❓";b.setAttribute("aria-label","OTOČ KARTU");b.addEventListener("click",()=>flipCard(i,b));area.appendChild(b)})
}
flipCard(i,b){
 const card=memoryGame.memoryCards[i];if(memoryGame.lockMemory||audioBusy||card.matched||card.open)return;
 card.open=true;paintPicture(b,card.word);b.classList.remove("faceDown");
 if(memoryGame.firstCard===null){speak(card.word[0]);memoryGame.firstCard=i;return}
 const previous=memoryGame.memoryCards[memoryGame.firstCard];const previousButton=el("choices").children[memoryGame.firstCard];
 if(previous.id===card.id){card.matched=true;previous.matched=true;b.classList.add("matched");previousButton.classList.add("matched");memoryGame.pairsFound++;el("count").textContent=memoryGame.pairsFound+" / 4";el("stars").textContent="⭐ "+memoryGame.pairsFound;el("bar").style.width=memoryGame.pairsFound*25+"%";memoryGame.firstCard=null;
 speak(card.word[0],{once:true,onEnd:()=>giveFeedback(true)});if(memoryGame.pairsFound===4){el("next").textContent="🏆 HOTOVO";el("next").classList.remove("hide");scheduleAdvance()}}
 else{memoryGame.lockMemory=true;memoryGame.firstCard=null;b.classList.add("wrong");previousButton.classList.add("wrong");const currentCards=memoryGame.memoryCards;setTimeout(()=>{if(mode!=="memory"||el("game").classList.contains("hide")||memoryGame.memoryCards!==currentCards)return;card.open=false;previous.open=false;b.textContent="❓";previousButton.textContent="❓";b.classList.add("faceDown");previousButton.classList.add("faceDown");b.classList.remove("wrong");previousButton.classList.remove("wrong");memoryGame.lockMemory=false},2500);playWrong(card.word[0])}
}
}
const memoryGame = new MemoryGame();
class SceneGame extends BaseGame {
sceneStep=0;
sceneItems=[];
sceneScore=0;
sceneDone=false;
startScene(){sceneGame.sceneItems=shuffled(itemsForTopic(topicIndex)).slice(0,6);sceneGame.sceneStep=0;sceneGame.sceneScore=0;renderScene(true)}
renderScene(rebuild=false){
 audioBusy=false; el("spokenText").classList.add("hide");el("positionBoard").classList.add("hide");sceneGame.sceneDone=false;el("choices").classList.add("hide");el("sceneCanvas").classList.remove("hide");el("listen").classList.remove("hide");
 el("heading").textContent="🔎 "+topics[topicIndex].title;el("count").textContent=(sceneGame.sceneStep+1)+" / "+sceneGame.sceneItems.length;el("stars").textContent="⭐ "+sceneGame.sceneScore;el("bar").style.width=sceneGame.sceneStep/sceneGame.sceneItems.length*100+"%";el("message").textContent="👂 POSLOUCHEJ A NAJDI";el("next").classList.add("hide");
 const area=el("sceneCanvas");area.classList.toggle("level2",difficulty===2);
 if(rebuild){
  area.replaceChildren();const layout=sceneLayouts[topicIndex]||sceneLayouts[0];area.dataset.theme=layout.theme;
  layout.decor.forEach(([emoji,x,y,size])=>{const span=document.createElement("span");span.className="sceneDecor";span.textContent=emoji;span.style.left=x+"%";span.style.top=y+"%";span.style.fontSize=size+"px";span.style.transform="translate(-50%,-50%)";area.appendChild(span)});
  const spots=shuffled(layout.spots).slice(0,sceneGame.sceneItems.length);
  sceneGame.sceneItems.forEach((w,i)=>{const [x,y]=spots[i];const b=document.createElement("button");b.className="sceneItem";paintPicture(b,w);b.style.left=x+"%";b.style.top=y+"%";b.style.setProperty("--w","19%");b.style.setProperty("--h","21%");b.setAttribute("aria-label","NAJÍT "+accessibleWord(w));b.addEventListener("click",()=>chooseScene(b,w));area.appendChild(b)});
  const hint=document.createElement("div");hint.className="sceneHint";hint.textContent="👆 NAJDI SPRÁVNÝ OBRÁZEK";area.appendChild(hint)
 }
 area.querySelectorAll(".sceneItem").forEach(b=>b.classList.remove("correct","wrong"));
 speak(sceneGame.sceneItems[sceneGame.sceneStep][0]);
}
chooseScene(b,w){
 if(sceneGame.sceneDone||audioBusy)return;
 if(w===sceneGame.sceneItems[sceneGame.sceneStep]){sceneGame.sceneDone=true;sceneGame.sceneScore++;b.classList.add("correct");giveFeedback(true);scheduleAdvance();el("stars").textContent="⭐ "+sceneGame.sceneScore;el("next").textContent=sceneGame.sceneStep===sceneGame.sceneItems.length-1?"🏆 VÝSLEDEK":"➡️ DÁL";el("next").classList.remove("hide")}
 else{playWrong(w[0],{highlight:b})}
}
nextScene(){stopAudio();audioBusy=false;sceneGame.sceneStep++;if(sceneGame.sceneStep<sceneGame.sceneItems.length){renderScene(false)}else{score=sceneGame.sceneScore;finishGame(sceneGame.sceneItems.length)}}
}
const sceneGame = new SceneGame();
class PositionGame extends BaseGame {
positionRound=[];
positionStep=0;
positionScore=0;
positionAnswered=false;
startPosition(){
 positionGame.positionRound=shuffled(positionQuestions);positionGame.positionStep=0;positionGame.positionScore=0;renderPosition();
}
renderPosition(){
 audioBusy=false; el("spokenText").classList.add("hide");el("placementArea").classList.add("hide");positionGame.positionAnswered=false;el("sceneCanvas").classList.add("hide");el("choices").classList.add("hide");el("positionBoard").classList.remove("hide");el("listen").classList.remove("hide");
 const question=positionGame.positionRound[positionGame.positionStep];
 el("heading").textContent="🧭 KDE JE CO?";
 el("count").textContent=(positionGame.positionStep+1)+" / "+positionGame.positionRound.length;el("stars").textContent="⭐ "+positionGame.positionScore;el("bar").style.width=positionGame.positionStep/positionGame.positionRound.length*100+"%";el("message").textContent="👂 POSLOUCHEJ A UKAŽ";el("next").classList.add("hide");
 const area=el("positionBoard");area.replaceChildren();
 positionDirections.forEach((d,i)=>{const b=document.createElement("button");b.className="positionCell";b.textContent=positionObjects[question.object].icon;b.setAttribute("aria-label",d.label+" – "+positionObjects[question.object].name);b.addEventListener("click",()=>choosePosition(b,d));area.appendChild(b)});
 speak(positionSpeech());
}
positionSpeech(){const q=positionGame.positionRound[positionGame.positionStep];return difficulty===1?q.speech:q.sentence}
choosePosition(button,d){
 if(positionGame.positionAnswered||audioBusy)return;
 if(d.id===positionGame.positionRound[positionGame.positionStep].dir){
  positionGame.positionAnswered=true;positionGame.positionScore++;button.classList.add("correct");giveFeedback(true);scheduleAdvance();el("stars").textContent="⭐ "+positionGame.positionScore;el("next").textContent=positionGame.positionStep===positionGame.positionRound.length-1?"🏆 VÝSLEDEK":"➡️ DÁL";el("next").classList.remove("hide");
 }else{playWrong(({oben:"oben",unten:"unten",links:"links",rechts:"rechts",mitte:"in der Mitte"})[d.id],{highlight:button})}
}
nextPosition(){stopAudio();audioBusy=false;positionGame.positionStep++;if(positionGame.positionStep<positionGame.positionRound.length)renderPosition();else{score=positionGame.positionScore;finishGame(positionGame.positionRound.length)}}
}
const positionGame = new PositionGame();
class PlacementGame extends BaseGame {
placementRound=[];
placementStep=0;
placementScore=0;
placementDone=false;
placementSelected=null;
placementLocked=false;
placementPointer=null;
placementSpeech(){
 const q=placementGame.placementRound[placementGame.placementStep],o=placementObjects[q.object];
 return "Lege "+o.article+" "+(difficulty===2?o.adjective+" ":"")+o.noun+" "+placementPhrases[q.dir]+".";
}
startPlacement(){
 const questions=[];for(const dir of positionDirections)for(let i=0;i<placementObjects.length;i++)questions.push({dir:dir.id,object:i});
 placementGame.placementRound=shuffled(questions).slice(0,10);placementGame.placementStep=0;placementGame.placementScore=0;renderPlacement();
}
renderPlacement(){
 stopAudio();audioBusy=false;placementGame.placementLocked=false;placementGame.placementDone=false;placementGame.placementSelected=null;placementGame.placementPointer=null;
 el("positionBoard").classList.add("hide");el("sceneCanvas").classList.add("hide");el("choices").classList.add("hide");
 el("placementArea").classList.remove("hide");el("listen").classList.remove("hide");el("spokenText").classList.add("hide");
 el("heading").textContent="🧩 KAM TO PATŘÍ?";
 el("count").textContent=(placementGame.placementStep+1)+" / 10";el("stars").textContent="⭐ "+placementGame.placementScore;
 el("bar").style.width=placementGame.placementStep*10+"%";el("next").classList.add("hide");el("message").textContent="👂 POSLOUCHEJ A PŘESUŇ";
 const q=placementGame.placementRound[placementGame.placementStep],board=el("placementBoard"),choices=el("placementChoices");
 board.replaceChildren();choices.replaceChildren();
 positionDirections.forEach(d=>{
  const target=document.createElement("button");target.className="positionCell placementTarget";target.dataset.dir=d.id;
  target.setAttribute("aria-label",d.label);target.textContent="⬚";
  target.addEventListener("click",()=>placeSelected(d.id,target));
  board.appendChild(target);
 });
 const alternatives=shuffled(placementObjects.map((_,i)=>i).filter(i=>i!==q.object)).slice(0,3);
 shuffled([q.object,...alternatives]).forEach(i=>{
  const b=document.createElement("button");b.className="placementItem";b.innerHTML=placementPicture(placementObjects[i]);
  b.dataset.object=String(i);b.setAttribute("aria-label",placementObjects[i].noun==="Fußball"?"fotbalový míč – Fußball":placementObjects[i].noun);
  b.addEventListener("click",()=>selectPlacement(i,b));
  b.addEventListener("pointerdown",e=>{if(placementGame.placementLocked||placementGame.placementDone)return;placementGame.placementPointer={id:e.pointerId,x:e.clientX,y:e.clientY,i,button:b,moved:false};});
  b.addEventListener("pointermove",e=>{if(!placementGame.placementPointer||placementGame.placementPointer.id!==e.pointerId)return;
   if(Math.hypot(e.clientX-placementGame.placementPointer.x,e.clientY-placementGame.placementPointer.y)>12){placementGame.placementPointer.moved=true;placementGame.placementSelected=i;b.classList.add("selected");}
   if(placementGame.placementPointer.moved){document.querySelectorAll(".placementTarget").forEach(t=>t.classList.toggle("hover",!!targetAt(e.clientX,e.clientY)&&t===targetAt(e.clientX,e.clientY)));}});
  b.addEventListener("pointerup",e=>{if(!placementGame.placementPointer||placementGame.placementPointer.id!==e.pointerId)return;
   const moved=placementGame.placementPointer.moved;placementGame.placementPointer=null;document.querySelectorAll(".placementTarget").forEach(t=>t.classList.remove("hover"));
   if(moved){const t=targetAt(e.clientX,e.clientY);if(t)placeSelected(t.dataset.dir,t);}});
  b.addEventListener("pointercancel",()=>{placementGame.placementPointer=null;document.querySelectorAll(".placementTarget").forEach(t=>t.classList.remove("hover"))});
  choices.appendChild(b);
 });
 speak(placementSpeech());
}
targetAt(x,y){return [...document.querySelectorAll(".placementTarget")].find(t=>{const r=t.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom})}
selectPlacement(i,b){if(placementGame.placementLocked||placementGame.placementDone)return;placementGame.placementSelected=i;el("placementChoices").querySelectorAll(".placementItem").forEach(x=>x.classList.toggle("selected",x===b))}
placeSelected(dir,target){
 if(placementGame.placementSelected===null||placementGame.placementLocked||placementGame.placementDone)return;
 const q=placementGame.placementRound[placementGame.placementStep],selected=placementGame.placementSelected;
 const item=el("placementChoices").querySelector('[data-object="'+selected+'"]');
 if(selected===q.object&&dir===q.dir){
  placementGame.placementDone=true;placementGame.placementScore++;target.innerHTML=placementPicture(placementObjects[selected]);target.classList.add("correct");
  el("stars").textContent="⭐ "+placementGame.placementScore;el("bar").style.width=(placementGame.placementStep+1)*10+"%";
  giveFeedback(true);scheduleAdvance();el("next").textContent=placementGame.placementStep===9?"🏆 VÝSLEDEK":"➡️ DÁL";el("next").classList.remove("hide");
 }else{
  placementGame.placementLocked=true;
  const wrongWord=selected!==q.object?placementObjects[selected].noun:({oben:"oben",unten:"unten",links:"links",rechts:"rechts",mitte:"in der Mitte"})[dir];
  setTimeout(()=>{placementGame.placementLocked=false;if(item)item.classList.remove("selected");placementGame.placementSelected=null},1500);playWrong(wrongWord,{highlight:target});
 }
}
nextPlacement(){if(!placementGame.placementDone)return;placementGame.placementStep++;if(placementGame.placementStep<10)renderPlacement();else{score=placementGame.placementScore;finishGame(10)}}
}
const placementGame = new PlacementGame();
class Application {

cancelAdvance(){if(advanceTimer!==null){clearTimeout(advanceTimer);advanceTimer=null}}
scheduleAdvance(){cancelAdvance();advanceTimer=setTimeout(()=>{advanceTimer=null;if(!el("game").classList.contains("hide"))next()},3000)}
showWord(word){if(el("game").classList.contains("hide"))return;el("spokenWords").textContent=word.toLocaleUpperCase("de-DE");el("spokenText").classList.remove("hide")}
currentTaskSpeech(){
 if(mode==="placement")return placementSpeech();
 if(mode==="position")return positionSpeech();
 if(mode==="scene")return sceneGame.sceneItems[sceneGame.sceneStep]?.[0]||"";
 if(mode==="quiz")return round[step]?.[0]||"";
 return "";
}
playInstructions(){speak(gameInstructions[mode],{once:true,showWord:false})}
display(id){clearWrongHighlight();cancelAdvance();clearTimeout(wrongAnswerWatchdog);wrongAnswerWatchdog=null;stopAudio();audioBusy=false;placementGame.placementLocked=false;if(id!=="game")el("spokenText").classList.add("hide");for(const name of ["home","game","finish","rhymes"])el(name).classList.toggle("hide",name!==id);if(id!=="game"){el("positionBoard").classList.add("hide");el("placementArea").classList.add("hide")}}
topicsUI(){const area=el("topics");area.replaceChildren();topics.forEach((t,i)=>{const b=document.createElement("button");b.className="topic";const pic=document.createElement("span");pic.className="picture";pic.textContent=t.icon;const label=document.createElement("span");label.textContent=t.title;b.append(pic,label);b.addEventListener("click",()=>start(i));area.appendChild(b)})}
start(i){clearWrongHighlight();cancelAdvance();stopAudio();audioBusy=false;topicIndex=i;round=shuffled(itemsForTopic(i)).slice(0,6);step=0;score=0;display("game");if(mode==="position")startPosition();else if(mode==="placement")startPlacement();else if(mode==="memory")startMemory();else if(mode==="explore")renderExplore();else if(mode==="scene")startScene();else{render();speak(round[step][0])}}
next(){clearWrongHighlight();cancelAdvance();stopAudio();audioBusy=false;if(mode==="placement"){nextPlacement();return}if(mode==="position"){nextPosition();return}if(mode==="scene"){nextScene();return}if(mode==="memory"){score=memoryGame.pairsFound;finishGame(4);return}step++;if(step<round.length){render();speak(round[step][0]);return}el("bar").style.width="100%";try{const key="nemcina-hrou-"+difficulty+"-"+topicIndex;localStorage.setItem(key,String(Math.max(score,Number(localStorage.getItem(key)||0))))}catch(e){}el("result").textContent="⭐ "+score+" / "+round.length;display("finish");speak("Sehr gut!")}
startPositionFromHome(){stopAudio();display("game");if(mode==="placement")startPlacement();else startPosition()}
setDifficulty(value){difficulty=value;stopAudio();for(const n of [1,2]){const button=el("level"+n);button.classList.toggle("active",n===value);button.setAttribute("aria-pressed",String(n===value))}el("levelHelp").textContent=value===1?"JEDNODUCHÁ SLOVÍČKA A OBRÁZKY":"BAREVNÉ LISTY, ČERNÝ KLOBOUK, SLUNCE SVÍTÍ A DALŠÍ VĚTY"}
finishGame(total){el("result").textContent="⭐ "+score+" / "+total;display("finish");speak("Sehr gut!")}
showRhymes(){
 stopAudio();display("rhymes");const area=el("rhymeList");area.replaceChildren();
 rhymes.forEach(r=>{
  const card=document.createElement("div");card.className="rhymeCard";const icon=document.createElement("span");icon.className="emoji";icon.textContent=r.icon;
  const title=document.createElement("h2");title.textContent=r.title;card.append(icon,title);
  const lineButtons=r.lines.map((line,i)=>{const b=document.createElement("button");b.className="rhymeLine";b.textContent="🔊 "+line;b.addEventListener("click",()=>playLine(i));card.appendChild(b);return b});
  function highlight(i){lineButtons.forEach((b,j)=>b.classList.toggle("active",i===j))}
  function playLine(i){highlight(i);speak(r.lines[i])}
  const tools=document.createElement("div");tools.className="rhymeTools";
  const full=document.createElement("button");full.textContent="▶️ CELÁ ŘÍKANKA";full.addEventListener("click",()=>{highlight(-1);speak(r.speech)});
  const step=document.createElement("button");step.textContent="🎵 PO ŘÁDCÍCH";step.addEventListener("click",()=>{
   function playIndex(i){if(i>=r.lines.length){highlight(-1);return}highlight(i);speak(r.lines[i],{once:true,onEnd:()=>{audioManager.repeatTimer=setTimeout(()=>playIndex(i+1),900)}})}
   playIndex(0)
  });
  tools.append(full,step);card.appendChild(tools);area.appendChild(card)
 })
}
}
const application = new Application();
const stopAudio = audioManager.stopAudio.bind(audioManager);
const audioFile = audioManager.audioFile.bind(audioManager);
const speak = audioManager.speak.bind(audioManager);
const playErrorTone = audioManager.playErrorTone.bind(audioManager);
const clearWrongHighlight = feedbackManager.clearWrongHighlight.bind(feedbackManager);
const markWrongHighlight = feedbackManager.markWrongHighlight.bind(feedbackManager);
const playWrong = feedbackManager.playWrong.bind(feedbackManager);
const giveFeedback = feedbackManager.giveFeedback.bind(feedbackManager);
const soccerBallMarkup = pictureRenderer.soccerBallMarkup.bind(pictureRenderer);
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
const el=id=>document.getElementById(id);let difficulty=1,topicIndex=0,round=[],step=0,score=0,done=false,mode="quiz";
function shuffled(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
let speechToken=0;



let audioBusy=false,wrongAnswerWatchdog=null,advanceTimer=null;












const gameInstructions={
 placement:"Poslouchej a přesuň správný obrázek na správné místo.",
 quiz:"Poslouchej německé slovíčko a klepni na správný obrázek.",
 explore:"Klepni na obrázek a poslouchej, jak se řekne německy.",
 memory:"Otoč dvě kartičky a najdi stejný obrázek.",
 scene:"Poslouchej a najdi správný obrázek ve scéně.",
 position:"Poslouchej a ukaž, kde je obrázek. Nahoře, dole, vlevo, vpravo nebo uprostřed."
};

const feedbackMessages={
 correct:[{feedback:"Super!",label:"🌟 SUPER!"},{feedback:"Sehr gut!",label:"⭐ VÝBORNĚ!"},{feedback:"Prima gemacht!",label:"🎉 SKVĚLÁ PRÁCE!"},{feedback:"Richtig!",label:"✅ SPRÁVNĚ!"}],
 wrong:[{feedback:"Noch mal!",label:"💛 ZKUS TO ZNOVU!"},{feedback:"Nicht ganz!",label:"🌈 TO JEŠTĚ NENÍ ONO!"}]
};
let previousFeedback={correct:-1,wrong:-1};



// Shared illustration for every football appearance, independent of difficulty.













const sceneLayouts=[
 {theme:"colors",decor:[["☀️",80,10,54],["☁️",18,14,54],["🏡",76,49,108],["🌳",15,47,105],["🌼",45,82,35]],spots:[[28,30],[55,24],[43,54],[80,75],[19,77],[66,58],[53,83]]},
 {theme:"garden",decor:[["☀️",84,11,56],["☁️",20,15,64],["🌳",12,47,116],["🏡",79,54,115],["🌷",42,85,34]],spots:[[33,27],[55,22],[44,49],[24,72],[70,76],[59,57],[85,35]]},
 {theme:"autumn",decor:[["☁️",18,14,66],["🌳",82,44,120],["🍂",53,77,43],["🌾",13,80,53],["🏡",48,43,92]],spots:[[30,28],[63,20],[23,53],[71,59],[40,79],[81,80],[51,58]]},
 {theme:"garden",decor:[["☀️",84,11,56],["🌳",15,40,105],["🏡",77,45,103],["🌻",44,84,40],["🌿",9,81,50]],spots:[[31,29],[57,22],[44,52],[27,73],[71,76],[82,54],[52,84]]},
 {theme:"kitchen",decor:[["🪟",15,21,100],["🪴",78,29,73],["🪑",12,79,95],["🍽️",82,76,76]],spots:[[36,22],[59,24],[20,47],[47,49],[77,49],[32,78],[62,78]]},
 {theme:"garden",decor:[["☀️",80,10,52],["🌳",17,43,117],["🌼",81,81,42],["🌿",12,81,45]],spots:[[39,25],[64,26],[23,58],[52,52],[78,58],[38,81],[65,82]]},
 {theme:"people",decor:[["🪟",16,18,96],["🪴",83,22,74],["🛋️",51,77,130]],spots:[[25,31],[50,26],[76,31],[21,62],[52,55],[78,64],[45,84]]},
 {theme:"garden",decor:[["🌳",12,45,110],["☀️",85,11,58],["🏡",76,48,105],["🌷",42,81,37]],spots:[[30,29],[57,23],[42,52],[24,74],[72,77],[83,57],[55,83]]},
 {theme:"people",decor:[["🪟",14,20,105],["🪴",82,24,74],["🛋️",53,79,125]],spots:[[33,27],[63,24],[21,52],[48,51],[76,53],[32,77],[66,79]]}
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












el("positionStart").addEventListener("click",()=>startPositionFromHome());


el("instructions").addEventListener("click",playInstructions);
el("level1").addEventListener("click",()=>setDifficulty(1));
el("level2").addEventListener("click",()=>setDifficulty(2));
document.querySelectorAll(".mode").forEach(b=>b.addEventListener("click",()=>{mode=b.dataset.mode;stopAudio();playInstructions();const positions=mode==="position"||mode==="placement";el("positionStart").classList.toggle("hide",!positions);el("topics").classList.toggle("hide",positions);el("topicsHeading").classList.toggle("hide",positions);document.querySelectorAll(".mode").forEach(x=>x.classList.toggle("active",x===b));el("home").querySelector(".help").textContent=mode==="placement"?"PŘESUŇ OBRÁZEK NA SPRÁVNÉ MÍSTO.":mode==="position"?"POSLOUCHEJ A UKAŽ, KDE JE JABLKO, KLOBOUK NEBO ZVÍŘÁTKO.":mode==="memory"?"OTÁČEJ KARTY A NAJDI STEJNÉ OBRÁZKY.":mode==="explore"?"KLEPNI NA OBRÁZEK A POSLOUCHEJ NĚMECKÉ SLOVO.":"VYBER HRU, KLEPNI NA 🔊 A PAK NA SPRÁVNÝ OBRÁZEK."}));

el("listen").addEventListener("click",()=>{clearTimeout(wrongAnswerWatchdog);wrongAnswerWatchdog=null;audioBusy=false;placementGame.placementLocked=false;el("message").textContent="";speak(mode==="placement"?placementSpeech():mode==="position"?positionSpeech():mode==="scene"?sceneGame.sceneItems[sceneGame.sceneStep][0]:round[step][0])});el("next").addEventListener("click",next);el("back").addEventListener("click",()=>{stopAudio();display("home")});el("retry").addEventListener("click",()=>start(topicIndex));el("all").addEventListener("click",()=>{stopAudio();display("home")});const rhymes=[
 {icon:"🌈",title:"REGENBOGEN",lines:["REGEN, REGEN, KOMM HERBEI,","SONNE SCHEINT, DER HIMMEL FREI.","ROT UND GELB UND GRÜN UND BLAU,","EIN REGENBOGEN – SCHAU, SCHAU, SCHAU!"],speech:"Regen, Regen, komm herbei. Sonne scheint, der Himmel frei. Rot und gelb und grün und blau. Ein Regenbogen, schau, schau, schau!"},
 {icon:"🍂",title:"BUNTE BLÄTTER",lines:["BUNTE BLÄTTER, ROT UND GELB,","FLIEGEN LEISE DURCH DIE WELT.","EINS, ZWEI, DREI – SCHAU MAL HER,","DER WIND BLÄST SIE HIN UND HER!"],speech:"Bunte Blätter, rot und gelb. Fliegen leise durch die Welt. Eins, zwei, drei, schau mal her. Der Wind bläst sie hin und her!"},
 {icon:"☔",title:"REGENSCHIRM",lines:["ES REGNET, ES REGNET,","ICH NEHME MEINEN SCHIRM.","ICH NEHME MEINE GUMMISTIEFEL,","UND SPRINGE IN DIE PFÜTZEN!"],speech:"Es regnet, es regnet. Ich nehme meinen Schirm. Ich nehme meine Gummistiefel. Und springe in die Pfützen!"},
 {icon:"👋",title:"GUTEN MORGEN",lines:["GUTEN MORGEN!","WIE GEHT ES DIR?","MIR GEHT ES GUT!","UND WIE GEHT ES DIR?"],speech:"Guten Morgen! Wie geht es dir? Mir geht es gut! Und wie geht es dir?"}
];

el("rhymesButton").addEventListener("click",showRhymes);
el("rhymeBack").addEventListener("click",()=>{stopAudio();display("home")});
topicsUI();

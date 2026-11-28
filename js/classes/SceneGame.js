import { BaseGame } from "./BaseGame.js";

export class SceneGame extends BaseGame {
constructor(context){super(context);}

sceneStep=0;
sceneItems=[];
sceneScore=0;
sceneDone=false;
startScene(){
const { stopAudio, speak, playWrong, giveFeedback, accessibleWord, paintPicture, itemsForTopic, startScene, renderScene, chooseScene, nextScene, scheduleAdvance, next, finishGame, topics, el, shuffled, sceneLayouts, state } = this.context;
this.sceneItems=shuffled(itemsForTopic(state.topicIndex)).slice(0,6);this.sceneStep=0;this.sceneScore=0;renderScene(true)}
renderScene(rebuild=false){
const { stopAudio, speak, playWrong, giveFeedback, accessibleWord, paintPicture, itemsForTopic, startScene, renderScene, chooseScene, nextScene, scheduleAdvance, next, finishGame, topics, el, shuffled, sceneLayouts, state } = this.context;

 state.audioBusy=false; el("spokenText").classList.add("hide");el("positionBoard").classList.add("hide");this.sceneDone=false;el("choices").classList.add("hide");el("sceneCanvas").classList.remove("hide");el("listen").classList.remove("hide");
 el("heading").textContent="🔎 "+topics[state.topicIndex].title;el("count").textContent=(this.sceneStep+1)+" / "+this.sceneItems.length;el("stars").textContent="⭐ "+this.sceneScore;el("bar").style.width=this.sceneStep/this.sceneItems.length*100+"%";el("message").textContent="👂 POSLOUCHEJ A NAJDI";el("next").classList.add("hide");
 const area=el("sceneCanvas");area.classList.toggle("level2",state.difficulty===2);
 if(rebuild){
  area.replaceChildren();const layout=sceneLayouts[state.topicIndex]||sceneLayouts[0];area.dataset.theme=layout.theme;
  layout.decor.forEach(([emoji,x,y,size])=>{const span=document.createElement("span");span.className="sceneDecor";const names={"🌳":"der Baum","☀️":"die Sonne","☁️":"die Wolke","🍎":"der Apfel","🍄":"der Pilz","🦋":"der Schmetterling","🏠":"das Haus","🐦":"der Vogel","🌧️":"der Regen"};if(names[emoji])paintPicture(span,[names[emoji],emoji]);else span.textContent=emoji;span.style.left=x+"%";span.style.top=y+"%";span.style.fontSize=size+"px";span.style.transform="translate(-50%,-50%)";area.appendChild(span)});
  const spots=shuffled(layout.spots).slice(0,this.sceneItems.length);
  this.sceneItems.forEach((w,i)=>{const [x,y]=spots[i];const b=document.createElement("button");b.className="sceneItem";paintPicture(b,w);b.style.left=x+"%";b.style.top=y+"%";b.style.setProperty("--w","19%");b.style.setProperty("--h","21%");b.setAttribute("aria-label","NAJÍT "+accessibleWord(w));b.addEventListener("click",()=>chooseScene(b,w));area.appendChild(b)});
  const hint=document.createElement("div");hint.className="sceneHint";hint.textContent="👆 NAJDI SPRÁVNÝ OBRÁZEK";area.appendChild(hint)
 }
 area.querySelectorAll(".sceneItem").forEach(b=>b.classList.remove("correct","wrong"));
 speak(this.sceneItems[this.sceneStep][0]);
}
chooseScene(b,w){
const { stopAudio, speak, playWrong, giveFeedback, accessibleWord, paintPicture, itemsForTopic, startScene, renderScene, chooseScene, nextScene, scheduleAdvance, next, finishGame, topics, el, shuffled, sceneLayouts, state } = this.context;

 if(this.sceneDone||state.audioBusy)return;
 if(w===this.sceneItems[this.sceneStep]){this.sceneDone=true;this.sceneScore++;b.classList.add("correct");giveFeedback(true);scheduleAdvance();el("stars").textContent="⭐ "+this.sceneScore;el("next").textContent=this.sceneStep===this.sceneItems.length-1?"🏆 VÝSLEDEK":"➡️ DÁL";el("next").classList.remove("hide")}
 else{playWrong(w[0],{highlight:b})}
}
nextScene(){
const { stopAudio, speak, playWrong, giveFeedback, accessibleWord, paintPicture, itemsForTopic, startScene, renderScene, chooseScene, nextScene, scheduleAdvance, next, finishGame, topics, el, shuffled, sceneLayouts, state } = this.context;
stopAudio();state.audioBusy=false;this.sceneStep++;if(this.sceneStep<this.sceneItems.length){renderScene(false)}else{state.score=this.sceneScore;finishGame(this.sceneItems.length)}}
}

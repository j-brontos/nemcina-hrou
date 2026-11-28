import { BaseGame } from "./BaseGame.js";

export class PositionGame extends BaseGame {
constructor(context){super(context);}

positionRound=[];
positionStep=0;
positionScore=0;
positionAnswered=false;
startPosition(){
const { stopAudio, speak, playWrong, giveFeedback, startPosition, renderPosition, positionSpeech, choosePosition, nextPosition, scheduleAdvance, next, finishGame, el, shuffled, positionDirections, positionObjects, positionQuestions, state } = this.context;

 this.positionRound=shuffled(positionQuestions);this.positionStep=0;this.positionScore=0;renderPosition();
}
renderPosition(){
const { stopAudio, speak, playWrong, giveFeedback, startPosition, renderPosition, positionSpeech, choosePosition, nextPosition, scheduleAdvance, next, finishGame, el, shuffled, positionDirections, positionObjects, positionQuestions, state } = this.context;

 state.audioBusy=false; el("spokenText").classList.add("hide");el("placementArea").classList.add("hide");this.positionAnswered=false;el("sceneCanvas").classList.add("hide");el("choices").classList.add("hide");el("positionBoard").classList.remove("hide");el("listen").classList.remove("hide");
 const question=this.positionRound[this.positionStep];
 el("heading").textContent="KDE JE CO?";
 el("count").textContent=(this.positionStep+1)+" / "+this.positionRound.length;el("stars").textContent=this.positionScore;el("bar").style.width=this.positionStep/this.positionRound.length*100+"%";el("message").textContent="POSLOUCHEJ A UKAŽ";el("next").classList.add("hide");
 const area=el("positionBoard");area.replaceChildren();
 positionDirections.forEach((d,i)=>{const b=document.createElement("button");b.className="positionCell";this.context.paintPicture(b,[state.difficulty===2?question.sentence:question.speech,positionObjects[question.object].icon]);b.setAttribute("aria-label",d.label+" – "+positionObjects[question.object].name);b.addEventListener("click",()=>choosePosition(b,d));area.appendChild(b)});
 speak(positionSpeech());
}
positionSpeech(){
const { stopAudio, speak, playWrong, giveFeedback, startPosition, renderPosition, positionSpeech, choosePosition, nextPosition, scheduleAdvance, next, finishGame, el, shuffled, positionDirections, positionObjects, positionQuestions, state } = this.context;
const q=this.positionRound[this.positionStep];return state.difficulty===1?q.speech:q.sentence}
choosePosition(button,d){
const { stopAudio, speak, playWrong, giveFeedback, startPosition, renderPosition, positionSpeech, choosePosition, nextPosition, scheduleAdvance, next, finishGame, el, shuffled, positionDirections, positionObjects, positionQuestions, state } = this.context;

 if(this.positionAnswered||state.audioBusy)return;
 if(d.id===this.positionRound[this.positionStep].dir){
  this.positionAnswered=true;this.positionScore++;button.classList.add("correct");giveFeedback(true);scheduleAdvance();el("stars").textContent=this.positionScore;el("next").textContent=this.positionStep===this.positionRound.length-1?"VÝSLEDEK":"DÁL";el("next").classList.remove("hide");
 }else{playWrong(({oben:"oben",unten:"unten",links:"links",rechts:"rechts",mitte:"in der Mitte"})[d.id],{highlight:button})}
}
nextPosition(){
const { stopAudio, speak, playWrong, giveFeedback, startPosition, renderPosition, positionSpeech, choosePosition, nextPosition, scheduleAdvance, next, finishGame, el, shuffled, positionDirections, positionObjects, positionQuestions, state } = this.context;
stopAudio();state.audioBusy=false;this.positionStep++;if(this.positionStep<this.positionRound.length)renderPosition();else{state.score=this.positionScore;finishGame(this.positionRound.length)}}
}

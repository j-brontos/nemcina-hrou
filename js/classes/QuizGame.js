import { BaseGame } from "./BaseGame.js";

export class QuizGame extends BaseGame {
constructor(context){super(context);}


render(){
const { playWrong, giveFeedback, accessibleWord, paintPicture, itemsForTopic, render, choose, scheduleAdvance, next, topics, el, shuffled, state } = this.context;
 state.audioBusy=false;el("spokenText").classList.add("hide");el("positionBoard").classList.add("hide");el("placementArea").classList.add("hide");el("sceneCanvas").classList.add("hide");el("choices").classList.remove("hide");el("choices").className="choices"+(state.difficulty===2?" level2":"");el("listen").classList.remove("hide");state.done=false;const t=topics[state.topicIndex],correct=state.round[state.step];el("heading").textContent=t.title;el("count").textContent=(state.step+1)+" / "+state.round.length;el("stars").textContent=state.score;el("bar").style.width=(state.step/state.round.length*100)+"%";el("message").textContent="";el("next").classList.add("hide");const area=el("choices");area.replaceChildren();const options=shuffled([correct,...shuffled(itemsForTopic(state.topicIndex).filter(w=>w!==correct)).slice(0,3)]);options.forEach(w=>{const b=document.createElement("button");b.className="choice";paintPicture(b,w);b.setAttribute("aria-label","OBRÁZEK "+accessibleWord(w));b.addEventListener("click",()=>choose(b,w===correct,correct,w));area.appendChild(b)});}
choose(button,right,correct,selected){
const { playWrong, giveFeedback, accessibleWord, paintPicture, itemsForTopic, render, choose, scheduleAdvance, next, topics, el, shuffled, state } = this.context;
if(state.done||state.audioBusy)return;if(right){state.done=true;for(const b of el("choices").children)b.disabled=true;}if(right){state.score++;button.classList.add("correct");giveFeedback(true);scheduleAdvance()}else{playWrong(selected[0],{highlight:button})}el("stars").textContent=state.score;el("next").textContent=state.step===state.round.length-1?"VÝSLEDEK":"DÁL";if(right)el("next").classList.remove("hide")}
}

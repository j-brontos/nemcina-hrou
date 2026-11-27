import { BaseGame } from "./BaseGame.js";
import { speak, playWrong, giveFeedback, paintPicture, itemsForTopic, startMemory, flipCard, scheduleAdvance, next, el, shuffled, state } from "../application.js";
export class MemoryGame extends BaseGame {
memoryCards=[];
firstCard=null;
lockMemory=false;
pairsFound=0;
startMemory(){ state.audioBusy=false;el("spokenText").classList.add("hide");el("positionBoard").classList.add("hide");el("sceneCanvas").classList.add("hide");el("choices").classList.remove("hide");
 const selected=shuffled(itemsForTopic(state.topicIndex)).slice(0,4);
 this.memoryCards=shuffled(selected.flatMap((w,i)=>[{word:w,id:i},{word:w,id:i}]));
 this.firstCard=null;this.lockMemory=false;this.pairsFound=0;
 el("heading").textContent="🃏 PEXESO";el("count").textContent="0 / 4";el("stars").textContent="⭐ 0";el("bar").style.width="0%";el("listen").classList.add("hide");el("next").classList.add("hide");el("message").textContent="🃏 NAJDI DVOJICE";
 const area=el("choices");area.className="choices memory"+(state.difficulty===2?" level2":"");area.replaceChildren();
 this.memoryCards.forEach((card,i)=>{const b=document.createElement("button");b.className="choice faceDown";b.textContent="❓";b.setAttribute("aria-label","OTOČ KARTU");b.addEventListener("click",()=>flipCard(i,b));area.appendChild(b)})
}
flipCard(i,b){
 const card=this.memoryCards[i];if(this.lockMemory||state.audioBusy||card.matched||card.open)return;
 card.open=true;paintPicture(b,card.word);b.classList.remove("faceDown");
 if(this.firstCard===null){speak(card.word[0]);this.firstCard=i;return}
 const previous=this.memoryCards[this.firstCard];const previousButton=el("choices").children[this.firstCard];
 if(previous.id===card.id){card.matched=true;previous.matched=true;b.classList.add("matched");previousButton.classList.add("matched");this.pairsFound++;el("count").textContent=this.pairsFound+" / 4";el("stars").textContent="⭐ "+this.pairsFound;el("bar").style.width=this.pairsFound*25+"%";this.firstCard=null;
 speak(card.word[0],{once:true,onEnd:()=>giveFeedback(true)});if(this.pairsFound===4){el("next").textContent="🏆 HOTOVO";el("next").classList.remove("hide");scheduleAdvance()}}
 else{this.lockMemory=true;this.firstCard=null;b.classList.add("wrong");previousButton.classList.add("wrong");const currentCards=this.memoryCards;setTimeout(()=>{if(state.mode!=="memory"||el("game").classList.contains("hide")||this.memoryCards!==currentCards)return;card.open=false;previous.open=false;b.textContent="❓";previousButton.textContent="❓";b.classList.add("faceDown");previousButton.classList.add("faceDown");b.classList.remove("wrong");previousButton.classList.remove("wrong");this.lockMemory=false},2500);playWrong(card.word[0])}
}
}

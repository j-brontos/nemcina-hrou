import { BaseGame } from "./BaseGame.js";

export class ExploreGame extends BaseGame {
constructor(context){super(context);}


renderExplore(){
const { speak, accessibleWord, paintPicture, itemsForTopic, renderExplore, next, topics, el, state } = this.context;
 state.audioBusy=false;el("spokenText").classList.add("hide");el("positionBoard").classList.add("hide");el("sceneCanvas").classList.add("hide");el("choices").classList.remove("hide");
 const t=topics[state.topicIndex];el("heading").textContent=t.icon+" "+t.title;el("count").textContent="🔊";el("stars").textContent="⭐";el("bar").style.width="100%";el("listen").classList.add("hide");el("next").classList.add("hide");el("message").textContent="👆 KLEPNI NA OBRÁZEK";const area=el("choices");area.className="choices explore"+(state.difficulty===2?" level2":"");area.replaceChildren();
 itemsForTopic(state.topicIndex).forEach(w=>{const b=document.createElement("button");b.className="choice";paintPicture(b,w);b.setAttribute("aria-label","PŘEHRÁT "+accessibleWord(w));b.addEventListener("click",()=>{for(const c of area.children)c.classList.remove("correct");b.classList.add("correct");speak(w[0])});area.appendChild(b)})
}
}

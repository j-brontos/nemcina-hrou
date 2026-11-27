import { BaseGame } from "./BaseGame.js";
import { stopAudio, speak, playWrong, giveFeedback, placementPicture, placementSpeech, startPlacement, renderPlacement, targetAt, selectPlacement, placeSelected, nextPlacement, scheduleAdvance, next, finishGame, el, shuffled, positionDirections, placementObjects, placementPhrases, state } from "../application.js";
export class PlacementGame extends BaseGame {
placementRound=[];
placementStep=0;
placementScore=0;
placementDone=false;
placementSelected=null;
placementLocked=false;
placementPointer=null;
placementSpeech(){
 const q=this.placementRound[this.placementStep],o=placementObjects[q.object];
 return "Lege "+o.article+" "+(state.difficulty===2?o.adjective+" ":"")+o.noun+" "+placementPhrases[q.dir]+".";
}
startPlacement(){
 const questions=[];for(const dir of positionDirections)for(let i=0;i<placementObjects.length;i++)questions.push({dir:dir.id,object:i});
 this.placementRound=shuffled(questions).slice(0,10);this.placementStep=0;this.placementScore=0;renderPlacement();
}
renderPlacement(){
 stopAudio();state.audioBusy=false;this.placementLocked=false;this.placementDone=false;this.placementSelected=null;this.placementPointer=null;
 el("positionBoard").classList.add("hide");el("sceneCanvas").classList.add("hide");el("choices").classList.add("hide");
 el("placementArea").classList.remove("hide");el("listen").classList.remove("hide");el("spokenText").classList.add("hide");
 el("heading").textContent="🧩 KAM TO PATŘÍ?";
 el("count").textContent=(this.placementStep+1)+" / 10";el("stars").textContent="⭐ "+this.placementScore;
 el("bar").style.width=this.placementStep*10+"%";el("next").classList.add("hide");el("message").textContent="👂 POSLOUCHEJ A PŘESUŇ";
 const q=this.placementRound[this.placementStep],board=el("placementBoard"),choices=el("placementChoices");
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
  b.addEventListener("pointerdown",e=>{if(this.placementLocked||this.placementDone)return;this.placementPointer={id:e.pointerId,x:e.clientX,y:e.clientY,i,button:b,moved:false};});
  b.addEventListener("pointermove",e=>{if(!this.placementPointer||this.placementPointer.id!==e.pointerId)return;
   if(Math.hypot(e.clientX-this.placementPointer.x,e.clientY-this.placementPointer.y)>12){this.placementPointer.moved=true;this.placementSelected=i;b.classList.add("selected");}
   if(this.placementPointer.moved){document.querySelectorAll(".placementTarget").forEach(t=>t.classList.toggle("hover",!!targetAt(e.clientX,e.clientY)&&t===targetAt(e.clientX,e.clientY)));}});
  b.addEventListener("pointerup",e=>{if(!this.placementPointer||this.placementPointer.id!==e.pointerId)return;
   const moved=this.placementPointer.moved;this.placementPointer=null;document.querySelectorAll(".placementTarget").forEach(t=>t.classList.remove("hover"));
   if(moved){const t=targetAt(e.clientX,e.clientY);if(t)placeSelected(t.dataset.dir,t);}});
  b.addEventListener("pointercancel",()=>{this.placementPointer=null;document.querySelectorAll(".placementTarget").forEach(t=>t.classList.remove("hover"))});
  choices.appendChild(b);
 });
 speak(placementSpeech());
}
targetAt(x,y){return [...document.querySelectorAll(".placementTarget")].find(t=>{const r=t.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom})}
selectPlacement(i,b){if(this.placementLocked||this.placementDone)return;this.placementSelected=i;el("placementChoices").querySelectorAll(".placementItem").forEach(x=>x.classList.toggle("selected",x===b))}
placeSelected(dir,target){
 if(this.placementSelected===null||this.placementLocked||this.placementDone)return;
 const q=this.placementRound[this.placementStep],selected=this.placementSelected;
 const item=el("placementChoices").querySelector('[data-object="'+selected+'"]');
 if(selected===q.object&&dir===q.dir){
  this.placementDone=true;this.placementScore++;target.innerHTML=placementPicture(placementObjects[selected]);target.classList.add("correct");
  el("stars").textContent="⭐ "+this.placementScore;el("bar").style.width=(this.placementStep+1)*10+"%";
  giveFeedback(true);scheduleAdvance();el("next").textContent=this.placementStep===9?"🏆 VÝSLEDEK":"➡️ DÁL";el("next").classList.remove("hide");
 }else{
  this.placementLocked=true;
  const wrongWord=selected!==q.object?placementObjects[selected].noun:({oben:"oben",unten:"unten",links:"links",rechts:"rechts",mitte:"in der Mitte"})[dir];
  setTimeout(()=>{this.placementLocked=false;if(item)item.classList.remove("selected");this.placementSelected=null},1500);playWrong(wrongWord,{highlight:target});
 }
}
nextPlacement(){if(!this.placementDone)return;this.placementStep++;if(this.placementStep<10)renderPlacement();else{state.score=this.placementScore;finishGame(10)}}
}

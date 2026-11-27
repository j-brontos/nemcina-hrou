import { audioManager, stopAudio, speak, playErrorTone, clearWrongHighlight, markWrongHighlight, playWrong, giveFeedback, showWord, currentTaskSpeech, el, feedbackMessages, state } from "../application.js";
export class FeedbackManager {
errorToneContext=null;
activeWrongHighlight=null;
clearWrongHighlight(){if(this.activeWrongHighlight){this.activeWrongHighlight.classList.remove("wrong");this.activeWrongHighlight=null}}
markWrongHighlight(element){clearWrongHighlight();if(element){element.classList.add("wrong");this.activeWrongHighlight=element}}
playWrong(word,options={}){
 // Tone -> selected answer -> original German error feedback -> original task.
 // A new answer can interrupt the sequence immediately.
 stopAudio();state.audioBusy=false;
 let sequenceToken=audioManager.playbackToken;
 const task=currentTaskSpeech();
 if(options.highlight)markWrongHighlight(options.highlight);
 const wrongChoices=feedbackMessages.wrong;
 let index=Math.floor(Math.random()*wrongChoices.length);
 if(wrongChoices.length>1&&index===state.previousFeedback.wrong)index=(index+1)%wrongChoices.length;
 state.previousFeedback.wrong=index;
 const feedback=wrongChoices[index];
 const active=()=>sequenceToken===audioManager.playbackToken&&!el("game").classList.contains("hide");
 el("message").textContent=feedback.label;
 const replayTask=()=>{
  if(!active())return;
  clearWrongHighlight();
  if(task&&state.mode!=="memory"){showWord(task);speak(task,{once:true,quick:true});sequenceToken=audioManager.playbackToken}
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
 if(choices.length>1&&index===state.previousFeedback[kind])index=(index+1+Math.floor(Math.random()*(choices.length-1)))%choices.length;
 state.previousFeedback[kind]=index;const chosen=choices[index];
 el("message").textContent=chosen.label;speak(chosen.feedback,{once:true,showWord:false,onEnd:options.onEnd});
}
}


export class FeedbackManager {
constructor(context){this.context=context;}

errorToneContext=null;
activeWrongHighlight=null;
clearWrongHighlight(){
const { audioManager, stopAudio, speak, playErrorTone, clearWrongHighlight, markWrongHighlight, playWrong, giveFeedback, showWord, currentTaskSpeech, el, feedbackMessages, state } = this.context;
if(this.activeWrongHighlight){this.activeWrongHighlight.classList.remove("wrong");this.activeWrongHighlight=null}}
markWrongHighlight(element){
const { audioManager, stopAudio, speak, playErrorTone, clearWrongHighlight, markWrongHighlight, playWrong, giveFeedback, showWord, currentTaskSpeech, el, feedbackMessages, state } = this.context;
clearWrongHighlight();if(element){element.classList.add("wrong");this.activeWrongHighlight=element}}
playWrong(word,options={}){
const { audioManager, stopAudio, speak, playErrorTone, clearWrongHighlight, markWrongHighlight, playWrong, giveFeedback, showWord, currentTaskSpeech, el, feedbackMessages, state } = this.context;

 // Keep the marked answer visible through the last syllable of the repeated task.
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
  if(task&&state.mode!=="memory"){showWord(task);sequenceToken=audioManager.playbackToken+1;speak(task,{once:true,quick:1.2,onEnd:()=>{if(active())clearWrongHighlight()}})}
  else {if(word)showWord(word);clearWrongHighlight()}
 };
 const playFalsch=()=>{
  if(!active())return;
  sequenceToken=audioManager.playbackToken+1;
  speak("Falsch!",{once:true,quick:1.2,showWord:false,onEnd:replayTask});
 };
 const playFeedback=()=>{
  if(!active())return;
  el("message").textContent=feedback.label;
  sequenceToken=audioManager.playbackToken+1;speak(feedback.feedback,{once:true,quick:1.2,showWord:false,onEnd:playFalsch});
 };
 const playSelected=()=>{
  if(!active())return;
  if(word){sequenceToken=audioManager.playbackToken+1;speak(word,{once:true,quick:1.2,onEnd:playFeedback});}
  else playFeedback();
 };
 playSelected();
 if(options.onEnd)options.onEnd();
}
giveFeedback(correct,options={}){
const { audioManager, stopAudio, speak, playErrorTone, clearWrongHighlight, markWrongHighlight, playWrong, giveFeedback, showWord, currentTaskSpeech, el, feedbackMessages, state } = this.context;

 if(correct)clearWrongHighlight();
 const kind=correct?"correct":"wrong",choices=feedbackMessages[kind];let index=Math.floor(Math.random()*choices.length);
 if(choices.length>1&&index===state.previousFeedback[kind])index=(index+1+Math.floor(Math.random()*(choices.length-1)))%choices.length;
 state.previousFeedback[kind]=index;const chosen=choices[index];
 el("message").textContent=chosen.label;speak(chosen.feedback,{once:true,showWord:false,onEnd:options.onEnd});
}
}


export class AudioManager {
constructor(context){this.context=context;}

audioPlayer=null;
speechUtterance=null;
repeatTimer=null;
playbackToken=0;
stopAudio(){
const { feedbackManager, stopAudio, audioFile, speak, playErrorTone, showWord, start, el, state } = this.context;
this.playbackToken++;if(this.speechUtterance){this.speechUtterance=null;globalThis.speechSynthesis?.cancel()}if(this.repeatTimer){clearTimeout(this.repeatTimer);this.repeatTimer=null}if(this.audioPlayer){this.audioPlayer.pause();this.audioPlayer.onended=null;this.audioPlayer=null}}
audioFile(word){
const { feedbackManager, stopAudio, audioFile, speak, playErrorTone, showWord, start, el, state } = this.context;
return "audio/"+encodeURIComponent(word).replace(/[!'()*]/g,c=>"%"+c.charCodeAt(0).toString(16).toUpperCase()).replace(/%/g,"_")+".mp3"}
speak(word,options={}){
const { feedbackManager, stopAudio, audioFile, speak, playErrorTone, showWord, start, el, state } = this.context;

 stopAudio();const token=this.playbackToken;
 if(options.showWord!==false)showWord(word);
 let completed=false;const finish=()=>{if(completed||token!==this.playbackToken)return;completed=true;if(options.onEnd)options.onEnd()};
 if(!el("voice").checked){finish();return}
 const speed=el("slow").checked?0.78:1,twice=el("repeat").checked&&!options.once;
 const playOnce=(remaining)=>{
  if(token!==this.playbackToken)return;
  const player=new Audio();this.audioPlayer=player;player.playbackRate=options.quick?Math.min(1.2,speed*1.15):speed;player.preservesPitch=true;
  let settled=false,fallbackStarted=false;
  const next=()=>{if(settled||token!==this.playbackToken)return;settled=true;this.speechUtterance=null;if(remaining>1){this.repeatTimer=setTimeout(()=>playOnce(remaining-1),350)}else finish()};
  const unavailable=()=>{if(settled||token!==this.playbackToken)return;el("message").textContent="🔇 KLEPNI NA 🔊";next()};
  const fallback=()=>{if(settled||fallbackStarted||token!==this.playbackToken)return;fallbackStarted=true;player.onended=null;player.onerror=null;player.pause();
   try{const synth=globalThis.speechSynthesis;if(!synth||!globalThis.SpeechSynthesisUtterance){unavailable();return}const utterance=new SpeechSynthesisUtterance(word);utterance.lang="de-DE";utterance.rate=options.quick?Math.min(1.2,speed*1.15):speed;const voices=synth.getVoices();const voice=voices.find(v=>v.lang==="de-DE"&&v.localService)||voices.find(v=>v.lang.startsWith("de"));if(voice)utterance.voice=voice;this.speechUtterance=utterance;utterance.onend=next;utterance.onerror=unavailable;synth.speak(utterance)}catch(e){unavailable()}
  };
  player.onended=next;player.onerror=fallback;
  // Start native German speech within the original tap, not after a failed network request.
  if(globalThis.speechSynthesis&&globalThis.SpeechSynthesisUtterance){fallback();return}
  player.src=audioFile(word);try{const promise=player.play();if(promise&&promise.catch)promise.catch(fallback)}catch(e){fallback()}
 };
 playOnce(twice?2:1);
}
playErrorTone(onEnd){
const { feedbackManager, stopAudio, audioFile, speak, playErrorTone, showWord, start, el, state } = this.context;

 // Reliable single short chime; do not block speech if Web Audio is unavailable.
 const token=this.playbackToken;
 let completed=false;
 const finish=()=>{if(completed)return;completed=true;if(token===this.playbackToken)onEnd()};
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

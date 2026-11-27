import { feedbackManager, stopAudio, audioFile, speak, playErrorTone, showWord, start, el, state } from "../application.js";
export class AudioManager {
audioPlayer=null;
repeatTimer=null;
playbackToken=0;
stopAudio(){this.playbackToken++;if(this.repeatTimer){clearTimeout(this.repeatTimer);this.repeatTimer=null}if(this.audioPlayer){this.audioPlayer.pause();this.audioPlayer.onended=null;this.audioPlayer=null}}
audioFile(word){return "audio/"+encodeURIComponent(word).replace(/[!'()*]/g,c=>"%"+c.charCodeAt(0).toString(16).toUpperCase()).replace(/%/g,"_")+".mp3"}
speak(word,options={}){
 stopAudio();const token=this.playbackToken;
 if(options.showWord!==false)showWord(word);
 let completed=false;const finish=()=>{if(completed||token!==this.playbackToken)return;completed=true;if(options.onEnd)options.onEnd()};
 if(!el("voice").checked){finish();return}
 const speed=el("slow").checked?0.78:1,twice=el("repeat").checked&&!options.once;
 function playOnce(remaining){
  if(token!==this.playbackToken)return;
  const player=new Audio(audioFile(word));this.audioPlayer=player;player.playbackRate=options.quick?Math.min(1.2,speed*1.15):speed;player.preservesPitch=true;
  player.onended=()=>{if(token!==this.playbackToken)return;if(remaining>1){this.repeatTimer=setTimeout(()=>playOnce(remaining-1),350)}else finish()};
  player.onerror=()=>{if(token===this.playbackToken){el("message").textContent="🔇 ZVUK NENÍ DOSTUPNÝ";finish()}};
  try{const promise=player.play();if(promise&&promise.catch)promise.catch(()=>{if(token===this.playbackToken){el("message").textContent="🔇 KLEPNI NA 🔊";finish()}})}catch(e){finish()}
 }
 playOnce(twice?2:1);
}
playErrorTone(onEnd){
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

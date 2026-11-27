import test from 'node:test';
import assert from 'node:assert/strict';
import { BaseGame } from '../js/classes/BaseGame.js';
import { AudioManager } from '../js/classes/AudioManager.js';
import { VocabularyRepository } from '../js/classes/VocabularyRepository.js';
import { QuizGame } from '../js/classes/QuizGame.js';
test('game receives injected dependencies',()=>{const context={};const game=new QuizGame(context);assert.ok(game instanceof BaseGame);assert.equal(game.context,context)});
test('audio file naming preserves German characters',()=>{const audio=new AudioManager({});assert.equal(audio.audioFile('der Fußball'),'audio/der_20Fu_C3_9Fball.mp3')});
test('vocabulary selects difficulty',()=>{const state={difficulty:1};const repo=new VocabularyRepository({state,topics:[{items:['one']}],levelTwoItems:[['two']]});assert.deepEqual(repo.itemsForTopic(0),['one']);state.difficulty=2;assert.deepEqual(repo.itemsForTopic(0),['two'])});
test('wrong answer allows immediate correct retry',()=>{const state={done:false,audioBusy:false,score:0,step:0,round:[1,2]};const node=()=>({classList:{add(){},remove(){}},children:[]});const nodes=new Map();const el=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)};const game=new QuizGame({state,el,playWrong(){},giveFeedback(){},scheduleAdvance(){}});game.choose(node(),false,['a'],['b']);game.choose(node(),true,['a'],['a']);assert.equal(state.score,1);assert.equal(state.done,true)});

test('destroy cancels pending game callbacks',async()=>{const game=new BaseGame({});let called=false;game.defer(()=>{called=true},10);game.destroy();await new Promise(resolve=>setTimeout(resolve,30));assert.equal(called,false);assert.equal(game.timers.size,0)});

import {ApplicationState} from '../js/classes/ApplicationState.js';
test('session reset clears previous game progress but retains settings',()=>{const state=new ApplicationState();state.difficulty=2;state.mode='quiz';state.score=5;state.step=4;state.done=true;state.reset([['rot']]);assert.equal(state.score,0);assert.equal(state.step,0);assert.equal(state.done,false);assert.equal(state.difficulty,2);assert.deepEqual(state.round,[['rot']])});

test('enabled audio plays and invokes completion once',()=>{const old=globalThis.Audio;let player;globalThis.Audio=class{constructor(src){this.src=src;player=this}play(){return Promise.resolve()}pause(){}};try{let ended=0;const context={el:id=>({checked:id==='voice'}),showWord(){}};const audio=new AudioManager(context);context.stopAudio=audio.stopAudio.bind(audio);context.audioFile=audio.audioFile.bind(audio);audio.speak('rot',{onEnd:()=>ended++});assert.equal(player.src,'audio/rot.mp3');player.onended();player.onended();assert.equal(ended,1)}finally{globalThis.Audio=old}});
test('stale audio callback cannot complete a new request',()=>{const old=globalThis.Audio;globalThis.Audio=class{play(){return Promise.resolve()}pause(){}};try{let ended=0;const context={el:id=>({checked:id==='voice'}),showWord(){}};const audio=new AudioManager(context);context.stopAudio=audio.stopAudio.bind(audio);context.audioFile=audio.audioFile.bind(audio);audio.speak('rot',{onEnd:()=>ended++});const stale=audio.audioPlayer.onended;audio.speak('blau');stale();assert.equal(ended,0)}finally{globalThis.Audio=old}});

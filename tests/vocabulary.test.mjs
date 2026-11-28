import test from 'node:test';
import assert from 'node:assert/strict';
import {numbers,colors,activities,combinations,numberSentences,favorites,questions,phrases,extra,vocabulary,coloredNumber,newRhymes} from '../js/data/expandedVocabulary.js';
import {learningMarkup} from '../js/data/learningArt.js';
test('complete canonical catalog',()=>{assert.deepEqual(numbers.map(n=>n.value),Array.from({length:13},(_,i)=>i));assert.equal(colors.length,10);assert.equal(activities.length,7);assert.equal(combinations.length,6);assert.equal(numberSentences.length,6);assert.equal(favorites.length,7);assert.equal(questions.length,7);assert.equal(phrases.length,30);assert.equal(extra.length,27);assert.equal(new Set(vocabulary.map(e=>e.id)).size,vocabulary.length);assert.equal(new Set(vocabulary.map(e=>e.de.toLowerCase())).size,vocabulary.length);assert.ok(vocabulary.every(e=>e.cs))});
test('all dynamic number/color combinations and art',()=>{for(const n of numbers)for(const c of colors){for(const sentence of [false,true]){const e=coloredNumber(n.value,c.de,sentence);assert.ok(learningMarkup(e.art));assert.ok(e.de.includes(sentence?c.de:c.adjective))}}assert.equal(coloredNumber(3,'rosa').de,'die rosa Drei');assert.equal(coloredNumber(12,'weiß',true).de,'Die Zwölf ist weiß.')});
test('activities reuse distinct illustrations',()=>{assert.equal(new Set(activities.map(a=>learningMarkup(a.art))).size,7);for(const [i,a] of activities.entries()){assert.ok(learningMarkup(a.art));assert.equal(favorites[i].art,a.art);assert.equal(questions[i].art,a.art)}});
test('rhymes preserve line counts and full text',()=>{assert.deepEqual(newRhymes.map(r=>r.lines.length),[8,6,8]);for(const r of newRhymes)assert.equal(r.speech,r.lines.join(' '))});

test('all numbers use identical font size and alignment',()=>{for(const n of numbers)for(const key of [n.art,coloredNumber(n.value,'rot').art]){const svg=learningMarkup(key);assert.match(svg,/font-size="80"/);assert.match(svg,/x="50" y="77" text-anchor="middle"/)}});

import { PictureRenderer } from '../js/classes/PictureRenderer.js';
test('original colour tuples, fruit and activities use their intended art', () => {
 const renderer = new PictureRenderer();
 assert.match(renderer.pictureMarkup(['orange', 'color:orange']), /<circle .*fill="#ef8b32"/);
 assert.match(renderer.pictureMarkup(['die Orange', '🍊']), /\/orange\.webp/);
 assert.match(renderer.pictureMarkup(['rot', '🔴']), /<circle .*fill="#e64545"/);
 for (const [index, activity] of activities.entries()) {
  const art = renderer.pictureMarkup([activity.de, activity.art]);
  assert.match(art, /<img .*\/activity-[a-z]+\.webp/);
  for (const entry of [favorites[index], questions[index]]) {
   assert.equal(renderer.pictureMarkup([entry.de, entry.art]), art);
  }
 }
});

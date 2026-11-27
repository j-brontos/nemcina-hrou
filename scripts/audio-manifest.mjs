globalThis.document={getElementById:()=>({addEventListener(){},replaceChildren(){},appendChild(){}}),querySelectorAll:()=>[],createElement:()=>({append(){},addEventListener(){}})};
const a=await import('../js/application.js');
const words=new Map();
const add=(text,lang='de')=>{if(text)words.set(text,lang)};
for(const t of a.topics)for(const [w] of t.items)add(w);
for(const t of a.levelTwoItems)for(const [w] of t)add(w);
for(const q of a.positionQuestions){add(q.speech);add(q.sentence)}
for(const o of a.placementObjects){add(o.noun);for(const p of Object.values(a.placementPhrases)){add('Lege '+o.article+' '+o.noun+' '+p+'.');add('Lege '+o.article+' '+o.adjective+' '+o.noun+' '+p+'.')}}
for(const p of Object.values(a.placementPhrases))add(p);
for(const w of ['oben','unten','links','rechts','in der Mitte','Sehr gut!'])add(w);
for(const group of Object.values(a.feedbackMessages))for(const f of group)add(f.feedback);
for(const r of a.rhymes){add(r.speech);for(const line of r.lines)add(line)}
for(const w of Object.values(a.gameInstructions))add(w,'cs');
console.log(JSON.stringify([...words].map(([text,lang])=>({text,lang,path:a.audioFile(text)}))));

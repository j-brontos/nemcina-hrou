const fs=require('node:fs'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const html=fs.readFileSync('index.html','utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1];
// Read the actual game data and command function, independently compare every combination to the audio manifest.
const objects=JSON.parse(js.match(/const spatialObjects=(\[[\s\S]*?\n\]);/)[1]);
const manifest=new Set(execFileSync('python3',['scripts/build_audio.py','--list'],{encoding:'utf8'}).trim().split('\n'));
let checks=0;
for(const object of objects){
 assert.ok(manifest.has(object.noun));
 for(const key of ['acc','detail'])for(const dir of ['nach links','nach rechts','nach oben','nach unten','in die Mitte']){
  assert.ok(manifest.has(`Lege ${object[key]} ${dir}.`));checks++;
 }
}
assert.ok(manifest.has('Poslouchej a přesuň správný obrázek na správné místo.'));
console.log(`PASS: ${checks} spatial commands, five nouns and Czech instruction covered by MP3 manifest (not file availability)`);

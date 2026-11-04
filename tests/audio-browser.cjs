// Real MP3 smoke check; run after scripts/build_audio.py. No Audio mock.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const server=require('node:http').createServer((req,res)=>{
  const file=req.url.startsWith('/audio/')?path.join('audio',path.basename(req.url)):'index.html';
  if(!fs.existsSync(file)){res.writeHead(404);res.end();return}
  res.setHeader('Content-Type',file.endsWith('.mp3')?'audio/mpeg':'text/html');res.end(fs.readFileSync(file));
 });await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox','--disable-crash-reporter']});const page=await browser.newPage();
 await page.goto('http://127.0.0.1:'+server.address().port);await page.locator('.topic').first().click();
 for(const word of ['Lege den Apfel nach links.','Lege den braunen Pilz in die Mitte.','Poslouchej a přesuň správný obrázek na správné místo.']){
  const result=await page.evaluate(word=>new Promise(resolve=>{
   const start=performance.now();el('message').textContent='';speak(word,{once:true,onEnd:()=>resolve({elapsed:performance.now()-start,message:el('message').textContent})});
  }),word);assert.ok(result.elapsed>300&&result.elapsed<20000,word);assert.equal(result.message,'',word);
 }
 await browser.close();server.close();console.log('PASS: three natural MP3 recordings played to completion in Chromium; no human pronunciation review');
})().catch(e=>{console.error(e);process.exit(1)});

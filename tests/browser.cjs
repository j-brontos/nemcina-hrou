const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const server=require('node:http').createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end(fs.readFileSync('index.html'))});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox','--disable-crash-reporter']});
 let checks=0;
 async function check(page,fn,label){assert.ok(await page.evaluate(fn),label);checks++}
 for(const viewport of [{width:375,height:812},{width:320,height:568},{width:768,height:1024}]){
 const context=await browser.newContext({viewport,hasTouch:true,isMobile:true});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.audioCalls=[];window.Audio=class{constructor(src){this.src=src;audioCalls.push(src)}play(){this.timer=setTimeout(()=>this.onended?.(),30);return Promise.resolve()}pause(){clearTimeout(this.timer)}}});
 await page.goto('http://127.0.0.1:'+server.address().port);
 await page.locator('.topic').first().click();
 await page.evaluate(()=>{const b=[...el('choices').children].find(b=>b.getAttribute('aria-label')!=='OBRÁZEK '+round[step][0]);b.click();b.click()});
 await check(page,()=>el('choices').querySelectorAll('.correct').length===0,'Quiz never reveals answer');
 await page.waitForTimeout(450);
 await check(page,()=>!audioBusy&&!done&&!el('choices').querySelector('.wrong'),'Quiz retry unlocked');
 await page.evaluate(()=>[...el('choices').children].find(b=>b.getAttribute('aria-label')==='OBRÁZEK '+round[step][0]).click());await page.waitForTimeout(60);
 await check(page,()=>score===1&&done&&!el('next').classList.contains('hide'),'Quiz completes after error');
 await page.locator('#back').click();await page.locator('[data-mode=spatial]').click();await page.locator('#positionStart').click();await page.waitForTimeout(100);
 await check(page,()=>el('spatialTray').children.length===4&&el('spatialBoard').children.length===5,'Four objects / five targets');
 await check(page,()=>[...el('spatialBoard').children].every(b=>{const r=b.getBoundingClientRect();return r.width>=60&&r.height>=60&&r.left>=0&&r.right<=innerWidth}),'Usable targets fit width');
 await check(page,()=>{const r=el('spatialBoard').getBoundingClientRect();return r.height<innerHeight&&r.width<=innerWidth},'Entire board fits viewport');
 await page.evaluate(()=>{const q=spatialRound[0];placeSpatial(q.object,positionDirections.find(d=>d.id!==q.dir).id);placeSpatial(q.object,q.dir)});
 await check(page,()=>score===0&&!el('spatialBoard').querySelector('.correct'),'Wrong position and rapid repeat rejected');await page.waitForTimeout(380);
 await page.evaluate(()=>{const q=spatialRound[0];placeSpatial(q.options.find(i=>i!==q.object),q.dir)});await page.waitForTimeout(420);
 await check(page,()=>score===0&&!spatialAnswered&&!audioBusy&&!el('spatialBoard').querySelector('.correct'),'Wrong object rejected, retry allowed');
 await page.locator('#listen').click();await page.waitForTimeout(60);
 await check(page,()=>audioCalls.at(-1)===audioFile(spatialSpeech()),'Replay instruction');
 const calls=await page.evaluate(()=>{el('slow').checked=true;el('repeat').checked=true;return audioCalls.length});
 await page.locator('#listen').click();await page.waitForTimeout(450);
 assert.equal(await page.evaluate(()=>audioCalls.length),calls+2);checks++;
 await check(page,()=>audioPlayer.playbackRate===0.78,'Slow replay rate');
 await page.evaluate(()=>{el('slow').checked=false;el('repeat').checked=false});
 // Real mouse pointer gesture exercises pointer capture and hit testing.
 const drag=await page.evaluate(()=>{const q=spatialRound[0];return {source:el('spatialTray').querySelector('[data-object="'+q.object+'"]').getBoundingClientRect().toJSON(),target:el('spatialBoard').querySelector('[data-dir="'+q.dir+'"]').getBoundingClientRect().toJSON()}});
 await page.mouse.move(drag.source.x+20,drag.source.y+20);await page.mouse.down();await page.mouse.move(5,5,{steps:10});await page.mouse.up();
 await check(page,()=>score===0&&spatialSelected===null&&!document.querySelector('.dragPreview'),'Drop outside returns image');
 await page.mouse.move(drag.source.x+20,drag.source.y+20);await page.mouse.down();await page.mouse.move(drag.target.x+25,drag.target.y+25,{steps:10});await page.mouse.up();await page.waitForTimeout(80);
 await check(page,()=>score===1&&spatialAnswered&&!!el('spatialBoard').querySelector('.correct'),'Pointer drag accepts correct placement');
 // CDP dispatches actual touch input through Chromium's event pipeline.
 const cdp=await context.newCDPSession(page);
 await page.locator('#next').click();await page.waitForTimeout(40);
 const touch=await page.evaluate(()=>{const q=spatialRound[spatialStep];return {s:el('spatialTray').querySelector('[data-object="'+q.object+'"]').getBoundingClientRect().toJSON(),t:el('spatialBoard').querySelector('[data-dir="'+q.dir+'"]').getBoundingClientRect().toJSON()}});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:touch.s.x+25,y:touch.s.y+25}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:touch.t.x+25,y:touch.t.y+25}]});
 await check(page,()=>!!document.querySelector('.dragPreview')&&!!el('spatialBoard').querySelector('.hover'),'Touch drag preview / hover');
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(80);
 await check(page,()=>score===2&&spatialAnswered,'Touch drag placement');
 for(let n=2;n<10;n++){
  await page.locator('#next').click();await page.waitForTimeout(40);
  const q=await page.evaluate(()=>spatialRound[spatialStep]);
  await page.locator('#spatialTray [data-object="'+q.object+'"]').tap();await page.locator('#spatialBoard [data-dir="'+q.dir+'"]').tap();await page.waitForTimeout(60);
 }
 await page.locator('#next').click();await check(page,()=>!el('finish').classList.contains('hide')&&el('result').textContent==='⭐ 10 / 10','Ten tasks, ten stars');
 await page.locator('#all').click();
 await page.locator('.audioSettings summary').click();await page.locator('#voice').uncheck();await page.locator('#level2').click();await page.locator('#positionStart').click();await page.waitForTimeout(60);
 await page.evaluate(()=>{const q=spatialRound[0];placeSpatial(q.object,positionDirections.find(d=>d.id!==q.dir).id)});await page.waitForTimeout(350);
 await check(page,()=>!audioBusy&&score===0,'Muted feedback releases input');
 await check(page,()=>spatialSpeech().includes(spatialObjects[spatialRound[0].object].detail),'Level two uses declined adjectives');
 await page.evaluate(()=>{const q=spatialRound[0];placeSpatial(q.options.find(i=>i!==q.object),q.dir)});await page.locator('#back').click();await page.waitForTimeout(500);
 await check(page,()=>!audioBusy&&!el('home').classList.contains('hide'),'Exit cancels feedback');
 await page.locator('#voice').check();
 // Exercise the original modes through their UI and answer logic.
 for(const mode of ['explore','memory','scene','position']){
  await page.locator('[data-mode='+mode+']').click();
  if(mode==='position')await page.locator('#positionStart').click();else await page.locator('.topic').first().click();
  await page.waitForTimeout(70);
  if(mode==='explore'){await page.locator('#choices button').first().click();await page.waitForTimeout(50);await check(page,()=>!!el('choices').querySelector('.correct'),'Explore playback');}
  if(mode==='memory'){await page.evaluate(()=>{const i=memoryCards.findIndex((c,i)=>i>0&&c.word===memoryCards[0].word);flipCard(0,el('choices').children[0]);flipCard(i,el('choices').children[i])});await page.waitForTimeout(60);await check(page,()=>pairsFound===1,'Memory match');}
  if(mode==='scene'){await page.evaluate(()=>{const w=sceneItems[sceneStep];const b=[...el('sceneCanvas').querySelectorAll('button')].find(b=>b.getAttribute('aria-label')==='NAJÍT '+w[0]);chooseScene(b,w)});await check(page,()=>sceneScore===1,'Scene answer');}
  if(mode==='position'){await page.evaluate(()=>{const d=positionDirections.find(d=>d.id===positionRound[positionStep].dir);choosePosition(el('positionBoard').children[positionDirections.indexOf(d)],d)});await check(page,()=>positionScore===1,'Original position answer');}
  await page.locator('#back').click();
 }
 // Missing recording must settle feedback and preserve retry, without speech synthesis.
 await page.locator('[data-mode=quiz]').click();await page.locator('.topic').first().click();
 await page.evaluate(()=>{window.Audio=class{play(){return Promise.reject(new Error('missing MP3'))}pause(){}};const b=[...el('choices').children].find(b=>b.getAttribute('aria-label')!=='OBRÁZEK '+round[step][0]);b.click()});await page.waitForTimeout(350);
 await check(page,()=>!audioBusy&&!done&&!el('choices').querySelector('.correct'),'Missing MP3 allows retry without reveal');
 assert.deepEqual(errors,[],'No browser errors');await context.close();
 }
 await browser.close();server.close();console.log('PASS: '+checks+' browser checks across 320px, 375px and 768px; audio mocked; real Safari/devices unverified');
})().catch(e=>{console.error(e);process.exit(1)});

const {test,expect}=require('@playwright/test');
for(const level of [1,2])for(const mode of ['quiz','explore','memory','scene','position','placement'])test(mode+' level '+level,async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.locator('#topics .topic')).toHaveCount(12);
 await page.locator('#level'+level).click();
 await page.locator('[data-mode="'+mode+'"]').click();
 if(['position','placement'].includes(mode))await page.locator('#positionStart').click();else await page.locator('#topics .topic').first().click();
 await expect(page.locator('#game')).toBeVisible();
 await expect(page.locator('#heading')).not.toBeEmpty();
 await page.locator('#back').click();await expect(page.locator('#home')).toBeVisible();
 expect(errors).toEqual([]);
});

for(const level of [1,2])test('quiz immediate retry level '+level,async({page})=>{
 await page.goto('/');
 await page.locator('#level'+level).click();
 await page.locator('[data-mode="quiz"]').click();
 await page.locator('#topics .topic').first().click();
 const task=await page.evaluate(async()=>{const {state}=await import('/js/application.js');return state.round[state.step][0]});
 const choices=page.locator('#choices button');
 const labels=await choices.evaluateAll(nodes=>nodes.map(n=>n.getAttribute('aria-label')));
 const correct=labels.findIndex(l=>l==='OBRÁZEK '+task||l==='OBRÁZEK fotbalový míč – '+task);
 expect(correct).toBeGreaterThanOrEqual(0);
 const wrong=labels.findIndex((_,i)=>i!==correct);
 await choices.nth(wrong).click();
 await expect(choices.nth(wrong)).toHaveClass(/wrong/);
 await choices.nth(correct).click();
 await expect(page.locator('#stars')).toHaveText('1');
 await expect(page.locator('#count')).toHaveText('2 / 6',{timeout:6000});
});

for(const level of [1,2])for(const mode of ['quiz','explore','memory','scene'])for(const topic of [9,10,11])test('new topic '+topic+' '+mode+' '+level,async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
 await page.locator('#level'+level).click();await page.locator('[data-mode="'+mode+'"]').click();await page.locator('#topics .topic').nth(topic).click();
 await expect(page.locator('#game')).toBeVisible();
 if(mode==='memory')await page.locator('#choices button').first().click();
 await expect(page.locator('#game .learningArt').first()).toBeVisible();
 for(const image of await page.locator('#game img.learningArt:visible').all())await expect.poll(()=>image.evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true);
 expect(errors).toEqual([]);
});
test('three new rhymes appear',async({page})=>{await page.goto('/');await page.locator('#rhymesButton').click();await expect(page.locator('.rhymeCard')).toHaveCount(7);await expect(page.locator('.rhymeCard').nth(4).locator('.rhymeLine')).toHaveCount(8);await expect(page.locator('.rhymeCard').nth(5).locator('.rhymeLine')).toHaveCount(6);await expect(page.locator('.rhymeCard').nth(6).locator('.rhymeLine')).toHaveCount(8)});

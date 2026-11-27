const {test,expect}=require('@playwright/test');
for(const level of [1,2])for(const mode of ['quiz','explore','memory','scene','position','placement'])test(mode+' level '+level,async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.locator('#topics .topic')).toHaveCount(9);
 await page.locator('#level'+level).click();
 await page.locator('[data-mode="'+mode+'"]').click();
 if(['position','placement'].includes(mode))await page.locator('#positionStart').click();else await page.locator('#topics .topic').first().click();
 await expect(page.locator('#game')).toBeVisible();
 await expect(page.locator('#heading')).not.toBeEmpty();
 await page.locator('#back').click();await expect(page.locator('#home')).toBeVisible();
 expect(errors).toEqual([]);
});

const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const sizes = [[375,667],[390,844],[393,852],[430,932],[810,1080],[1080,810],[1440,900]];
const modes = ['quiz','explore','memory','scene','position','placement'];
const spatial = mode => mode === 'position' || mode === 'placement';

async function openMenu(page) {
  await page.goto('/');
  await expect(page.locator('.topic')).toHaveCount(12);
  await page.evaluate(() => document.fonts.ready);
}
async function mute(page) {
  await page.locator('summary').click();
  await page.locator('#voice').uncheck();
  await page.locator('summary').click();
}
async function enter(page, mode, topic = 3) {
  await page.locator('[data-mode="' + mode + '"].mode').click();
  if (spatial(mode)) await page.locator('#positionStart').click();
  else await page.locator('.topic').nth(topic).click();
  await expect(page.locator('#game')).toBeVisible();
}
async function picturesReady(page) {
  await page.evaluate(() => Promise.all(Array.from(document.images, i => i.decode())));
}
async function screenFits(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(await page.locator('button:visible,summary:visible').evaluateAll(nodes =>
    nodes.filter(n => n.offsetWidth < 44 || n.offsetHeight < 44 || n.scrollWidth > n.clientWidth + 2)
         .map(n => n.id || n.getAttribute('aria-label') || n.textContent))).toEqual([]);
}

for (const [width,height] of sizes) {
  test('responsive controls at ' + width + 'x' + height, async ({ page }) => {
    await page.setViewportSize({width,height});
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await openMenu(page);
    await mute(page);
    await screenFits(page);
    await picturesReady(page);
    await page.locator('#level2').click();
    for (const mode of modes) {
      await enter(page, mode);
      await screenFits(page);
      await picturesReady(page);
      await page.locator('#back').click();
      await expect(page.locator('.mode[aria-pressed=true]')).toHaveAttribute('data-mode', mode);
      await expect(page.locator('#level2')).toHaveAttribute('aria-pressed', 'true');
    }
    await page.locator('#rhymesButton').click();
    await screenFits(page);
    expect(errors).toEqual([]);
  });
}

test('every active image decodes under the Pages base path', async ({ page }) => {
  await openMenu(page);
  const count = await page.evaluate(async () => {
    const [{availableImages},{interfaceFiles},{imageUrl}] = await Promise.all([
      import('./js/data/imageManifest.js'),import('./js/data/interfaceArt.js'),import('./js/classes/ImageRepository.js')]);
    const files = [...Object.values(availableImages),...Object.values(interfaceFiles)];
    for (const file of files) {
      const i = new Image();
      i.src = imageUrl(file);
      await i.decode();
      if (!i.naturalWidth) throw new Error(file);
    }
    return files.length;
  });
  expect(count).toBe(132);
});

for (const level of [1,2]) {
  test('all twelve topics open in four lesson games, level ' + level, async ({page}) => {
    test.setTimeout(90000);
    await openMenu(page);
    await mute(page);
    await page.locator('#level'+level).click();
    for (const mode of modes.filter(m => !spatial(m))) {
      await page.locator('.mode[data-mode="'+mode+'"]').click();
      for (let i = 0; i < 12; i++) {
        await page.locator('.topic').nth(i).click();
        if (mode === 'memory') await page.locator('#choices button').first().click();
        await expect(page.locator('#game .learningArt:visible').first()).toBeVisible();
        await picturesReady(page);
        await page.locator('#back').click();
      }
    }
  });
}

test('place an item by tapping and by dragging', async ({page}, info) => {
  await openMenu(page);
  await mute(page);
  await enter(page, 'placement');
  for (const action of ['tap','drag']) {
    const q = await page.evaluate(async () => {
      const {placementGame:g} = await import('./js/application.js');
      return g.placementRound[g.placementStep];
    });
    const item = page.locator('.placementItem[data-object="'+q.object+'"]');
    const target = page.locator('.placementTarget[data-dir="'+q.dir+'"]');
    if (action === 'tap') {
      if (info.project.use.hasTouch) { await item.tap(); await target.tap(); }
      else { await item.click(); await target.click(); }
    } else {
      await item.dragTo(target);
    }
    await expect(target).toHaveClass(/correct/);
    await expect(target.locator('img')).toHaveAttribute('src',await item.locator('img').getAttribute('src'));
    await page.locator('#next').click();
  }
});

test('picture-book review on iPhone 15', async ({page}, info) => {
  test.skip(info.project.name !== 'webkit-mobile', 'Capture the mobile WebKit rendering.');
  test.setTimeout(90000);
  await page.setViewportSize({width:393,height:852});
  await openMenu(page);
  const dir = path.resolve('test-results','iphone15-review');
  fs.mkdirSync(dir,{recursive:true});
  const capture = async (name, locator) => {
    await picturesReady(page);
    const options = {path:path.join(dir,name+'.png'),scale:'css',animations:'disabled'};
    if (locator) await locator.screenshot(options);
    else await page.screenshot(options);
  };
  await capture('01-menu');
  await capture('02-lekce', page.locator('#lessonPanel'));
  await page.locator('summary').click();
  await capture('12-nastaveni', page.locator('details'));
  await page.locator('#voice').uncheck();
  await page.locator('summary').click();
  const names=['03-poslouchej','04-prohlizej','05-pexeso','06-najdi','07-kde','08-kam'];
  for (const [index,mode] of modes.entries()) {
    await enter(page,mode);
    if (mode==='memory') await page.locator('.faceDown').first().click();
    await capture(names[index]);
    await page.locator('#back').click();
  }
  await page.locator('#rhymesButton').click();
  await capture('09-rikanky');
  await page.locator('#rhymeBack').click();
  await enter(page,'quiz');
  for(let i=0;i<6;i++) {
    const task = await page.evaluate(async () => {
      const {state} = await import('./js/application.js');
      return state.round[state.step][0];
    });
    await page.getByRole('button',{name:'OBRÁZEK '+task,exact:true}).click();
    await page.locator('#next').click();
  }
  await expect(page.locator('#result')).toHaveText('6 / 6');
  await capture('10-odmena');
  await page.locator('#retry').click();
  await expect(page.locator('#count')).toHaveText('1 / 6');
});

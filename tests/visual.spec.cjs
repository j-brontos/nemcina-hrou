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
  expect(await page.locator('#game button .learningArt:visible').evaluateAll(images =>
    images.filter(image => {
      const bounds = image.closest('button').getBoundingClientRect();
      const art = image.getBoundingClientRect();
      return art.width < 1 || art.height < 1 || art.top < bounds.top - 1 || art.left < bounds.left - 1 ||
        art.bottom > bounds.bottom + 1 || art.right > bounds.right + 1;
    }).map(image => image.closest('button').getAttribute('aria-label')))).toEqual([]);
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
  // Mount the checked-in files at the same nested URL used by GitHub Pages.
  const rootRequests = [];
  page.on('request', req => {
    const pathname = new URL(req.url()).pathname;
    if (!pathname.startsWith('/nemcina-hrou/')) rootRequests.push(pathname);
  });
  await page.route('**/nemcina-hrou/**', async route => {
    const url = new URL(route.request().url());
    url.pathname = url.pathname.slice('/nemcina-hrou'.length);
    await route.fulfill({response:await route.fetch({url:url.href})});
  });
  await page.goto('/nemcina-hrou/');
  await expect(page.locator('.topic')).toHaveCount(12);
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
  expect(rootRequests).toEqual([]);
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

test('place an item by tapping and by dragging', async ({page,browserName}, info) => {
  await openMenu(page);
  await mute(page);
  await enter(page, 'placement');
  const actions = browserName === 'chromium' ? ['tap','drag','touch-drag'] : ['tap','drag'];
  for (const action of actions) {
    const q = await page.evaluate(async () => {
      const {placementGame:g} = await import('./js/application.js');
      return g.placementRound[g.placementStep];
    });
    const item = page.locator('.placementItem[data-object="'+q.object+'"]');
    const target = page.locator('.placementTarget[data-dir="'+q.dir+'"]');
    if (action === 'tap') {
      if (info.project.use.hasTouch) { await item.tap(); await target.tap(); }
      else { await item.click(); await target.click(); }
    } else if (action === 'drag') {
      await item.dragTo(target);
    } else {
      await page.setViewportSize({width:393,height:852});
      await item.scrollIntoViewIfNeeded();
      const finger = await page.context().newCDPSession(page);
      await finger.send('Emulation.setTouchEmulationEnabled',{enabled:true});
      const from = await item.boundingBox(), to = await target.boundingBox();
      const x = from.x + from.width/2, y = from.y + from.height/2;
      const dx = to.x + to.width/2 - x, dy = to.y + to.height/2 - y;
      await finger.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
      for (let i=1;i<=6;i++) {
        await finger.send('Input.dispatchTouchEvent',{
          type:'touchMove',touchPoints:[{x:x+dx*i/6,y:y+dy*i/6}]
        });
      }
      await finger.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      await finger.detach();
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
  await page.locator('#lessonPanel').evaluate(n => window.scrollTo(0, window.scrollY + n.getBoundingClientRect().top - 22));
  await capture('02-lekce');
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

// Advance the actual AudioManager callbacks one clip at a time. This makes the
// highlight boundary observable without depending on an installed speaker.
test('wrong answer never reveals the solution and stays marked through replay', async ({page}, info) => {
  await page.addInitScript(() => {
    window.reviewClips = [];
    window.Audio = class {
      constructor(src) { this.src = src; }
      play() { window.reviewClips.push(this); return Promise.resolve(); }
      pause() {}
    };
  });
  await openMenu(page);
  for (const mode of ['quiz','scene','position','placement']) {
    await enter(page, mode);
    const {rightSelector,wrongSelector,target,selected,task,feedback} = await page.evaluate(async mode => {
      const a = await import('./js/application.js');
      let rightSelector, wrongSelector, target, selected;
      if (mode === 'quiz' || mode === 'scene') {
        const choices = mode === 'quiz' ? '#choices button' : '#sceneCanvas button';
        const prefix = mode === 'quiz' ? 'OBRÁZEK ' : 'NAJÍT ';
        const nodes = [...document.querySelectorAll(choices)];
        const task = a.currentTaskSpeech();
        const wrong = nodes.find(n => n.getAttribute('aria-label') !== prefix + task);
        selected = wrong.getAttribute('aria-label').slice(prefix.length);
        wrongSelector = choices + '[aria-label="' + prefix + selected + '"]';
        rightSelector = choices + '[aria-label="' + prefix + task + '"]';
      } else if (mode === 'position') {
        const q = a.positionGame.positionRound[0];
        const right = a.positionDirections.findIndex(d => d.id === q.dir);
        const wrong = right === 0 ? 1 : 0;
        selected = a.positionDirections[wrong].id;
        wrongSelector = '#positionBoard button:nth-child(' + (wrong+1) + ')';
        rightSelector = '#positionBoard button:nth-child(' + (right+1) + ')';
      } else {
        const q = a.placementGame.placementRound[0];
        target = '.placementItem[data-object="' + q.object + '"]';
        selected = q.dir === 'oben' ? 'links' : 'oben';
        wrongSelector = '.placementTarget[data-dir="' + selected + '"]';
        rightSelector = '.placementTarget[data-dir="' + q.dir + '"]';
      }
      return {rightSelector,wrongSelector,target,selected:a.audioFile(selected),
        task:a.audioFile(a.currentTaskSpeech()),feedback:a.feedbackMessages.wrong.map(f => a.audioFile(f.feedback))};
    },mode);
    if (target) await page.locator(target).click();
    await page.locator(wrongSelector).click();
    for (const expected of [[selected],feedback,['audio/Falsch_21.mp3'],[task]]) {
      expect(expected).toContain(await page.evaluate(() => window.reviewClips.at(-1).src));
      await expect(page.locator(wrongSelector)).toHaveClass(/wrong/);
      await expect(page.locator(rightSelector)).not.toHaveClass(/correct/);
      if (mode === 'quiz' && expected.includes(task) && info.project.name === 'webkit-mobile') {
        const dir = path.resolve('test-results','iphone15-review');
        fs.mkdirSync(dir,{recursive:true});
        await picturesReady(page);
        await page.screenshot({path:path.join(dir,'11-chybna-odpoved.png'),scale:'css'});
      }
      await page.evaluate(() => window.reviewClips.at(-1).onended());
    }
    await expect(page.locator(wrongSelector)).not.toHaveClass(/wrong/);
    await page.locator(rightSelector).click();
    await expect(page.locator('#stars')).toHaveText('1');
    await page.locator('#back').click();
  }
});

test('memory mismatch resets both cards and all four pairs lead to the reward', async ({page}) => {
  await openMenu(page);
  await mute(page);
  await enter(page,'memory');
  const ids = await page.evaluate(async () => (await import('./js/application.js')).memoryGame.memoryCards.map(c => c.id));
  const cards = page.locator('.memory .choice');
  const a = ids.indexOf(0), b = ids.indexOf(1);
  await cards.nth(a).click(); await cards.nth(b).click();
  await expect(page.locator('.memory .wrong')).toHaveCount(2);
  await expect(page.locator('.memory .faceDown')).toHaveCount(8,{timeout:5000});
  for (const id of [0,1,2,3]) {
    await cards.nth(ids.indexOf(id)).click();
    await cards.nth(ids.lastIndexOf(id)).click();
    await expect(page.locator('#stars')).toHaveText(String(id+1));
  }
  await page.locator('#next').click();
  await expect(page.locator('#result')).toHaveText('4 / 4');
});

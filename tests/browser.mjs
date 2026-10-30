import { chromium as playwright, expect } from '@playwright/test';
import chromium from '@sparticuz/chromium';
import fs from 'node:fs';
import zlib from 'node:zlib';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
// Bootstrap the shared libraries required by the sandboxed Chromium build on Debian.
if (process.platform === 'linux' && !process.env.CI) {
  const libDir = '/tmp/odooprep-chromium-libs';
  if (!fs.existsSync(`${libDir}/lib/libnss3.so`)) {
    fs.mkdirSync(libDir, { recursive: true });
    const pkg = fileURLToPath(new URL('../node_modules/@sparticuz/chromium/bin/al2023.tar.br', import.meta.url));
    const tarPath = '/tmp/odooprep-al2023.tar';
    fs.writeFileSync(tarPath, zlib.brotliDecompressSync(fs.readFileSync(pkg)));
    execFileSync('tar', ['-xf', tarPath, '-C', libDir]);
  }
  process.env.LD_LIBRARY_PATH = [`${libDir}/lib`, process.env.LD_LIBRARY_PATH].filter(Boolean).join(':');
}
fs.mkdirSync('artifacts', { recursive: true });
const bank=JSON.parse(fs.readFileSync('src/data/bank/questions.json','utf8'));
const root=process.env.BASE_URL||'http://localhost:5173';
const base=root.endsWith('/')?root:root+'/';
const errors=[];const log=(m)=>console.log('✓',m);
const browser=await playwright.launch({executablePath:process.env.CI?playwright.executablePath():await chromium.executablePath(),args:process.env.CI?[]:chromium.args,headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1050},acceptDownloads:true});
const page=await context.newPage();
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('odooprep.progress.v1')));
const shot=async(name)=>{await page.screenshot({path:`artifacts/${name}.png`,fullPage:true});};
const expectFont=async(target,family,selector='body')=>{
await expect(target.locator(selector)).toHaveCSS('font-family',new RegExp(family));
await target.evaluate(async()=>{await document.fonts.ready;});
expect(await target.evaluate(f=>Array.from(document.fonts).some(face=>face.family.includes(f)&&face.status==='loaded'),family)).toBe(true);
};
const currentId=async()=> (await page.locator('.question-id').first().innerText()).trim();
const answer=async(correct=true,reveal=false)=>{const id=await currentId();const q=bank.find(x=>x.id===id);const opts=q.options.filter(o=>correct?o.correct:!o.correct);for(const o of opts.slice(0,q.type==='multiple'?opts.length:1)){await page.locator('.answer-option').filter({hasText:o.text.en}).click();}if(reveal)await page.getByRole('button',{name:'Show answer & explanation'}).click();return id;};
try{
await page.goto(base,{waitUntil:'networkidle'});
await expect(page.getByRole('heading',{name:'Your learning overview'})).toBeVisible();
await expect(page.locator('.hero-art-card')).toContainText('1,000');
await expectFont(page,'Inter Variable');await shot('01-dashboard-en-light');log('Dashboard renders with the full bank using Inter');
await page.locator('.language-button').click();await expect(page.locator('html')).toHaveAttribute('dir','rtl');await expect(page.getByRole('heading',{name:'نظرة عامة على تعلّمك'})).toBeVisible();await expectFont(page,'Cairo Variable');await shot('02-dashboard-ar-light');
await page.locator('.theme-toggle').click();await expect(page.locator('html')).toHaveClass(/dark/);await shot('03-dashboard-ar-dark');
await page.reload({waitUntil:'networkidle'});await expect(page.locator('html')).toHaveAttribute('lang','ar');await expect(page.locator('html')).toHaveClass(/dark/);
await page.locator('.language-button').click();await expectFont(page,'Inter Variable');await shot('04-dashboard-en-dark');await page.locator('.theme-toggle').click();await expect(page.locator('html')).not.toHaveClass(/dark/);log('All four language/theme combinations render and persist with Inter/Cairo fonts');
await page.getByRole('link',{name:'Learning paths'}).click();await page.getByRole('link',{name:'Explore this stage'}).first().click();await page.getByRole('button',{name:'Start learning'}).click();await expect(page).toHaveURL(/\/exam$/);
const first=await answer(true,true);await expect(page.locator('.explanation-panel')).toBeVisible();await page.getByRole('button',{name:'Bookmark question'}).click();expect((await state()).attempts).toHaveLength(1);expect((await state()).bookmarks).toContain(first);
await page.getByRole('button',{name:'Next question'}).click();const second=await answer(false,true);await page.reload({waitUntil:'networkidle'});await expect(page.locator('.question-id')).toHaveText(second);await expect(page.locator('.explanation-panel')).toBeVisible();expect((await state()).active.index).toBe(1);
await page.locator('.language-button').click();await expect(page.locator('html')).toHaveAttribute('dir','rtl');await expectFont(page,'Cairo Variable','.exam-question-text');await expect(page.locator('.answer-option.chosen')).toHaveCount(1);await page.locator('.language-button').click();await page.getByRole('button',{name:'Previous'}).click();await expect(page.locator('.question-id')).toHaveText(first);log('Learning mode scores, reveals, bookmarks, navigates, and preserves state and Arabic Cairo question font across reload/language changes');
await page.goto(base+'#/exams');await page.getByLabel('Custom question count').fill('10');await page.getByRole('button',{name:'Stage 1',exact:true}).click();await page.getByLabel('Module',{exact:true}).selectOption('navigation');await page.getByRole('button',{name:'Start practice'}).click();await page.getByRole('button',{name:'Start new session'}).click();await expect(page).toHaveURL(/\/exam$/);
for(let i=0;i<3;i++){await answer(true,false);if(i===1)await page.getByRole('button',{name:'Flag for review'}).click();if(i<2)await page.getByRole('button',{name:'Next question'}).click();}
await page.getByRole('button',{name:'Finish session'}).click();await page.getByRole('button',{name:'Submit & see results'}).click();await expect(page).toHaveURL(/\/results\//);await expect(page.locator('.result-score')).toContainText('30');await page.getByRole('button',{name:'Incorrect & unanswered only'}).click();expect(await page.locator('.review-card').count()).toBe(7);log('Practice mode randomizes, flags, grades exact answers, and filters the result review');
await page.goto(base+'#/exams?mode=simulation');await page.getByLabel('Custom question count').fill('10');await page.getByLabel('Duration (minutes)').fill('1');await page.getByRole('button',{name:'Stage 1',exact:true}).click();await page.getByRole('button',{name:'Start simulation'}).click();const simId=await answer(true,false);await expect.poll(async()=>((await state()).active?.selections?.[simId]||[]).length).toBeGreaterThan(0);await page.reload({waitUntil:'networkidle'});await expect(page.locator('.exam-timer')).toBeVisible();await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('odooprep.progress.v1'));s.active.deadline=Date.now()-1000;localStorage.setItem('odooprep.progress.v1',JSON.stringify(s));});await page.reload({waitUntil:'networkidle'});await expect(page).toHaveURL(/\/results\//);await expect(page.locator('.result-score')).toContainText('10');expect((await state()).active).toBeNull();expect((await state()).exams).toHaveLength(2);log('Simulation timer survives reload and auto-submits at the persisted deadline');
await page.goto(base+'#/questions');await page.getByLabel('Stage',{exact:true}).selectOption('2');await page.getByLabel('Module',{exact:true}).selectOption('inventory');await page.getByLabel('Odoo version').selectOption('19');await expect(page.locator('.filter-footer')).toContainText('matching questions');await page.getByRole('button',{name:'Reset filters'}).click();await page.getByRole('button',{name:'Bookmark question'}).first().click();await page.getByRole('button',{name:'Next',exact:true}).click();await expect(page.locator('.pagination')).toContainText('16–30');log('Question-bank filters, bookmarks, and pagination work');
await page.goto(base+'#/versions');await expect(page.locator('.version-feature-grid')).toContainText('Field Service');await page.getByRole('button',{name:'Swap versions'}).click();await page.getByLabel('From version').selectOption('14');await page.getByLabel('To version').selectOption('15');await expect(page.locator('.version-feature-grid')).toContainText('Odoo 15');expect(await page.locator('.version-feature a[href*="odoo.com"]').count()).toBeGreaterThan(0);log('Version lab compares documented changes with official source links');
await page.goto(base+'#/advanced',{waitUntil:'networkidle'});await expect(page.getByRole('heading',{name:'100 advanced practical playbooks',exact:true})).toBeVisible();await expect(page.locator('.playbook-card')).toHaveCount(12);
await page.getByLabel('Search playbooks').fill('landed');await expect(page.locator('.playbook-card').first()).toBeVisible();await page.locator('.playbook-card h3 a').first().click();await expect(page.locator('.playbook-detail')).toBeVisible();await expect(page.getByRole('heading',{name:'Settings path'})).toBeVisible();
await page.getByRole('button',{name:'Save',exact:true}).click();await page.getByRole('button',{name:'Mark complete',exact:true}).click();await page.getByLabel('Playbook notes').fill('Remember to include the supplier bill in landed costs.');await page.getByRole('button',{name:'Save note',exact:true}).click();await page.reload({waitUntil:'networkidle'});await expect(page.getByRole('button',{name:'Saved',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Mark incomplete',exact:true})).toBeVisible();await expect(page.getByLabel('Notes')).toHaveValue('Remember to include the supplier bill in landed costs.');
await page.goto(base+'#/bookmarks',{waitUntil:'networkidle'});await expect(page.locator('.saved-playbook-list a[href="#/advanced/ADV-013"]')).toBeVisible();
await page.goto(base+'#/industries/IND-011',{waitUntil:'networkidle'});await expect(page.locator('.playbook-detail')).toBeVisible();await expect(page.getByRole('heading',{name:'Standard Odoo vs specialized systems'})).toBeVisible();await page.locator('.language-button').click();await expect(page.getByRole('heading',{name:'المستشفى: فوترة العيادات ومخزون الصيدلية وذمم التأمين'})).toBeVisible();await expectFont(page,'Cairo Variable','.playbook-detail h1');await expect(page.getByRole('heading',{name:'Odoo القياسي مقابل الأنظمة المتخصصة'})).toBeVisible();
await page.setViewportSize({width:390,height:844});const industryOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);if(industryOverflow)throw new Error('Arabic industry detail overflows on mobile');await page.setViewportSize({width:1440,height:1050});await page.locator('.language-button').click();await expect(page.getByRole('heading',{name:'Standard Odoo vs specialized systems'})).toBeVisible();log('Advanced and industry playbooks support search, detail, save, completion, notes, Arabic/RTL Cairo, and mobile layout');
await page.goto(base+'#/settings');const dl=page.waitForEvent('download');await page.getByRole('button',{name:'Export JSON'}).click();const download=await dl;await download.saveAs('artifacts/backup.json');expect(fs.existsSync('artifacts/backup.json')).toBe(true);
await page.locator('input[type=file]').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{}')});await expect(page.locator('.notice-warning').filter({hasText:'Import failed'})).toBeVisible();
const before=(await state()).preferences;await page.getByRole('button',{name:'Reset all progress'}).click();await page.getByRole('button',{name:'Yes, reset progress'}).click();expect((await state()).attempts).toHaveLength(0);expect((await state()).playbookCompleted).toHaveLength(0);expect(Object.keys((await state()).playbookNotes)).toHaveLength(0);expect((await state()).preferences).toEqual(before);
await page.locator('input[type=file]').setInputFiles('artifacts/backup.json');await page.getByRole('button',{name:'Restore backup'}).click();expect((await state()).attempts.length).toBeGreaterThan(0);log('JSON export, invalid-import rejection, reset, and backup restoration work');
const mobile=await context.newPage();await mobile.setViewportSize({width:390,height:844});mobile.on('pageerror',e=>errors.push(e.message));await mobile.goto(base,{waitUntil:'networkidle'});await mobile.getByRole('button',{name:'Open navigation'}).click();await mobile.locator('.sidebar a.nav-link[href="#/questions"]').click();await expect(mobile.getByRole('heading',{name:'The question bank'})).toBeVisible();await mobile.locator('.language-button').click();await expect(mobile.locator('html')).toHaveAttribute('dir','rtl');await expectFont(mobile,'Cairo Variable');const overflow=await mobile.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);expect(overflow).toBeLessThanOrEqual(1);await mobile.screenshot({path:'artifacts/05-mobile-ar-rtl.png',fullPage:true});log('Mobile navigation and Arabic RTL use Cairo and fit a 390px viewport without horizontal overflow');
expect(errors).toEqual([]);log('No browser runtime or console errors');
}catch(e){console.error('BROWSER ERRORS',errors);throw e;}finally{await browser.close();}

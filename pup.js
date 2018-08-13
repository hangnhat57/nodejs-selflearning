const puppeteer = require('puppeteer');
(async ()=>{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://news.ycombinator.com');
    await page.screenshot({path: 'hn.png'});

    await browser.close();
})();
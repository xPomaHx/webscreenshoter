(async () => {
    const puppeteer = require('puppeteer');
    const express = require('express')
    const app = express();

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 500,
    });
    app.get('/', function (req, res) {
        (async () => {
            if (!req.query.url) {
                res.send("no url");
                return
            }
            console.dir(req.query.url);
            await page.goto(req.query.url, {
                "waitUntil": "load"
            });
            await page.evaluate(async () => {
                await new Promise((resolve, reject) => {
                    let totalHeight = 0
                    let distance = 100
                    let timer = setInterval(() => {
                        let scrollHeight = document.body.scrollHeight
                        window.scrollBy(0, distance)
                        totalHeight += distance
                        if (totalHeight >= scrollHeight) {
                            clearInterval(timer)
                            resolve()
                        }
                    }, 100)
                })
            })
            let photo = await page.screenshot({
                fullPage: true,
            });
            res.type('png');
            res.send(photo);
        })();
    })
    app.listen(7852)
})();
const Apify = require('apify');

const { log } = Apify.utils;

async function getItems(pageObj, resultsArr, req) {
    // log which page is being scraped
    const requu = req.url.includes('pg=2') ? 'SCRAPING PAGE 2' : 'page 1';
    log.info(`REQUEST: ${requu} ${'\n'} ${req.url}`);
    // Scrape all items that match the selector
    const itemsObj = await pageObj.$$eval('div.p13n-sc-truncated', prods => prods.map(prod => prod.innerHTML));

    const pricesObj = await pageObj.$$eval('span.p13n-sc-price', price => price.map(el => el.innerHTML));

    const urlsObj = await pageObj.$$eval('span.aok-inline-block > a.a-link-normal', link => link.map(url => url.href));

    const imgsObj = await pageObj.$$eval('a.a-link-normal > span > div.a-section > img', link => link.map(url => url.src));

    // Get rid of duplicate URLs (couldn't avoid scraping them)
    const urlsArr = [];
    for (const link of urlsObj) {
        if (!urlsArr.includes(link)) {
            urlsArr.push(link);
        }
    }

    // Add scraped items to results array
    log.info('Creating results...');
    for (let i = 0; i < Object.keys(itemsObj).length; i++) {
        resultsArr.items[i] = {
            name: itemsObj[i],
            price: pricesObj[i],
            url: urlsArr[i],
            thumbnail: imgsObj[i],
        };
    }
}

module.exports = { getItems };

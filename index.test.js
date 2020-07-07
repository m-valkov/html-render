const htmlRender = require('./index');

// https://webscraper.io/test-sites/e-commerce/allinone/product/572

test('Test html-render', async () => {
    const page = await htmlRender.getPage({
        randomUserAgent: true,
        blockImages: true,
        blockCss: true,
        blockScript: true,
        blockMedia: true,
        blockList: [
            'yandex.ru',
            'yastatic.net',
            'googleapis.com',
            'yandex.net',
            'gstatic.com',
            'google.com/maps',
            'owl-carousel/owl.carousel.min.js',
            'revolution/ajax_search.js',
            'bootstrap/js/bootstrap.min.js',
            'revolution/amazoncategory.js'
        ],
    });

    await page.goto('https://webscraper.io/test-sites/e-commerce/allinone/product/572', {
        waitUntil: 'domcontentloaded'
    });

    await page.close();
    await htmlRender.closeRender();
})

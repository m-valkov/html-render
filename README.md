
# Модуль html-render

## Функции:
```javascript
       getPage([options]) // возвращает объект page 
                          // принимает объект options следующего вида:

           const options = {
               randomUserAgent: false || true,
               proxyAddress: "http://1.1.1.1:1111",
               blockImage: false || true,
               blockCss: false || true,
               blockMedia: false || true,
               debugRequest: false || true,
               showBrowser: false || true,
               blockList: ['some url pattern', ...]
           }

      closeRender() // закрывает рендер
```
## Пример использования

```javascript
const htmlRender = require('@walkit/html-render');

(async () => {

    const page = await htmlRender.getPage({
        randomUserAgent: true,
        proxyAddress: 'http://1.2.3.4:9999',
        blockImages: true,
        blockCss: true,
        blockScript: true,
        blockMedia: true,
        debugRequest: true,
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
        // showBrowser: true
    });
    
    // page используется так же, как и в чистом puppeteer

    console.time('Request time:')
    await page.goto('https://google.com', {
        waitUntil: 'domcontentloaded'
    });
    console.timeEnd('Request time:')

    await page.close();
    await htmlRender.closeRender();
})();
```
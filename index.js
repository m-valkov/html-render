/*
 *   Модуль PageRender
 *
 *   Функции:
 *
 *      getPage() - возвращает объект page
 *           принимает объект options следующего вида:
 *
 *           const options = {
 *               randomUserAgent: false || true
 *               proxyAddress: "http://1.1.1.1:1111",
 *               blockImage: false || true,
 *               blockCss: false || true,
 *               blockMedia: false || true,
 *               debugRequest: false || true,
 *               showBrowser: false || true,
 *               blockList: ['some url', ...]
 *           }
 *
 *       closeRender() - закрывает рендер
 */

const puppeteer = require('puppeteer');
const useProxy = require('puppeteer-page-proxy');
const userAgent = require('user-agents');


let browser = null;

const getPage = async (options) => {

    if (!browser) {
        browser = await puppeteer.launch({
            headless: !options.showBrowser
        })
    }

    let page = await browser.newPage();

    // установить user agent для страницы
    if (options.randomUserAgent) {
        await page.setUserAgent(new userAgent({
            deviceCategory: 'desktop'
        }).toString());
    }

    // фильтровать запросы
    await page.setRequestInterception(true);
    page.on('request', async request => {

        let requestBlocked = false;

        // блокировать все запросы из блок листа
        if (options.blockList) {
            options.blockList.forEach(url => {
                if (request.url().includes(url)) {
                    request.abort();
                    requestBlocked = true;
                }
            })
        }

        // блокировать все картинки
        if (request.resourceType() === 'image' && options.blockImages && !requestBlocked) {
            await request.abort();
            requestBlocked = true;
        }

        // блокировать загрузку стилей
        if (request.resourceType() === 'stylesheet' && options.blockCss && !requestBlocked) {
            await request.abort();
            requestBlocked = true;
        }

        // блокировать загрузку webm
        if (request.resourceType() === 'media' && options.blockMedia && !requestBlocked) {
            await request.abort();
            requestBlocked = true;
        }

        // блокировать скрипты
        if (request.resourceType() === 'script' && options.blockScript && !requestBlocked) {
            await request.abort();
            requestBlocked = true;
        }

        // если не заблокирован запрос, выполнить запрос или выполнить через прокси
        if (!requestBlocked) {

            // в режиме отладки выводить url каждого запроса
            if (options.debugRequest) {
                console.log(request.url())
            }

            // если есть прокси, то через прокси, если нет, то продолжить запрос
            if (!options.proxyAddress) {
                await request.continue();
            } else {
                await useProxy(request, options.proxyAddress);
            }
        }
    })

    return page
}

const closeRender = async () => {
    if (browser) {
        await browser.close();
        browser = null;
    }
}

module.exports = {
    getPage,
    closeRender
}
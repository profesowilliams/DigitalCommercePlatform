import { intouchHeaderAPIUrl, intouchFooterAPIUrl } from "../intouchUtils";
import { headerInfo, checkIntouchUser } from "../user/get";

const renderIntouchComponent = (url, loadToElement, loadend) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept-Language', headerInfo.acceptLanguage);

    xhr.onload = function () {
        if (xhr.status != 200) {
            console.error('Error ${xhr.status}: ${xhr.statusText}');
        } else { // show the result
            loadToElement.innerHTML = xhr.responseText;
        }
    };

    xhr.onloadend = loadend;

    xhr.withCredentials = true;
    xhr.send(null);
};

const renderIntouchHeaderHTML = () => {
    const url = intouchHeaderAPIUrl();
    const element = document.getElementById('intouch-headerhtml');

    if (!element) return;

    renderIntouchComponent(
        url,
        element,
        function () {
            console.log("Intouch header loaded");
            window.td.deferred.$htmlLoaded.resolve();
        }
    );
};

const renderIntouchFooterHTML = () => {
    const url = intouchFooterAPIUrl();
    const element = document.getElementById('intouch-footerhtml');

    if (!element) return;

    renderIntouchComponent(
        url,
        element,
        function () {
            console.log("Intouch footer loaded");
        }
    );
};

export const loadIntouchHeaderAndFooter = () => {
    console.log('loadIntouchHeaderAndFooter()');

    document.addEventListener(
        'DOMContentLoaded',
        function () {
            let authorMode = !(typeof Granite === 'undefined' || typeof Granite.author === 'undefined');
            if (!authorMode) {
                console.log('AUTHOR:Load header/footer');
                checkIntouchUser().then(function () { 
                    renderIntouchHeaderHTML();
                    renderIntouchFooterHTML();
                })
            } else {
                console.log('AUTHOR:Skip header/footer');
            }
        },
        false
    );
}
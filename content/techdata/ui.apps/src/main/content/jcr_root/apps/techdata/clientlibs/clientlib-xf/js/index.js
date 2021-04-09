(function(){
    console.log(xfDeliveryObj);
    var jqueryLib = xfDeliveryObj.reqJquery;

    var current = document.currentScript.parentNode;

    if (typeof jQuery === 'undefined') {
        current.appendChild(createScript(jqueryLib));
    }

    xfDeliveryObj.cssLibs.forEach(function(lib){
        current.appendChild(createStyle(lib));
    });

    xfDeliveryObj.jsLibs.forEach(function(lib){
        current.appendChild(createScript(lib));
    });

    current.insertAdjacentHTML("beforeEnd", b64DecodeUnicode(xfDeliveryObj.content));

    function createScript(link) {
        var el = document.createElement("script");
        el.src = link;
        return el;
    }

    function createStyle(link) {
        var el = document.createElement("link");
        el.rel = 'stylesheet';
        el.href = link;
        return el;
    }
    function b64DecodeUnicode(str) {
        return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
    }
})();
(function() {
    "use strict";
    function onDocumentReady() {
        const formElems = document.querySelectorAll('.form-style-container .cmp-form');
        formElems && formElems.forEach(formElem => {
            formElem && formElem.querySelectorAll('input, select,textarea').forEach(elem => {
                if (elem.closest('.cmp-form-text')) {
                    const labelText = elem.closest('.cmp-form-text').querySelector('label').innerText;
                } else if (elem.closest('.cmp-form-options')) {
                    const labelText = elem.closest('.cmp-form-options').querySelector('label').innerText;
                    const tag = document.createElement("option");
                    const text = document.createTextNode(labelText);
                    tag.setAttribute('value', '');
                    tag.setAttribute('selected', '');
                    tag.setAttribute('hidden', '');
                    tag.setAttribute('disabled', '');
                    tag.appendChild(text);
                    elem.prepend(tag);
                }
            });
        });
    };
    document.addEventListener("DOMContentLoaded", onDocumentReady);
})();
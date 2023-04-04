(function() {
    "use strict";
    function onDocumentReady() {

        function setTeaserHeight() {
            document.querySelectorAll('.cmp-container-triple-teaser').forEach((val) => {
                let maxHeight = 0;
                val.querySelectorAll('.cmp-teaser__title').forEach((ele) => {
                    ele.style.height = 'auto';
                    let eleHeight = ele.offsetHeight;
                    maxHeight = eleHeight > maxHeight ? eleHeight : maxHeight;
                });
                val.querySelectorAll('.cmp-teaser__title').forEach((ele) => {
                    ele.style.height = `${maxHeight}px`;
                });
            })
        };


        setTeaserHeight();
        window.addEventListener('resize', () => {
            setTeaserHeight();
        });


    };
    document.addEventListener("DOMContentLoaded", onDocumentReady);
})();

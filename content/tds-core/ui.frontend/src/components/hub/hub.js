(function() {
    "use strict";
    function onDocumentReady() {
        const dropdownBtns = document.querySelectorAll('.hub .cmp-button');

        dropdownBtns && dropdownBtns.forEach(function(dropdownBtn) {
            dropdownBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // closeActiveDropdowns();
                const targetDropdownBtn = e.target.closest('.hub');
                targetDropdownBtn.querySelector('.cmp-button__dropdown').classList.toggle("show");
                targetDropdownBtn.classList.toggle("active");
                const headerContainerEle = document.querySelector('#cmp-techdata-header');
                headerContainerEle?.classList.toggle('hub-menu-active');
            });
        });

        function closeActiveDropdowns() {
            dropdownBtns && dropdownBtns.forEach(function(dropdownBtn) {
                const targetDropdownBtn = dropdownBtn.closest('.hub');
                targetDropdownBtn.querySelector('.cmp-button__dropdown').classList.remove("show");
                targetDropdownBtn.classList.remove("active");
                const headerContainerEle = document.querySelector('#cmp-techdata-header');
                headerContainerEle?.classList.remove('hub-menu-active');
            });
        }

        window.addEventListener("click", function(event) {
            if (!(event.target.matches('.cmp-button') || event.target.matches('.cmp-button__text') || event.target.matches('path') || event.target.matches('.cmp-button__icon'))) {
                const dropdowns = document.querySelectorAll(".cmp-button__dropdown");
                const headerContainerEle = document.querySelector('#cmp-techdata-header');
                dropdowns && dropdowns.forEach(function(dropdown) {
                    if (dropdown.closest('.hub') && dropdown.closest('.hub').classList.contains('active')) {
                        dropdown.closest('.hub').classList.remove('active');
                        headerContainerEle?.classList.remove('hub-menu-active');
                    }
                    if (dropdown.classList.contains('show')) {
                        dropdown.classList.remove('show');
                    }
                });
            }
        });
    };
    document.addEventListener("DOMContentLoaded", onDocumentReady);
})();

(function() {
    "use strict";
    function onDocumentReady() {
        const dropdownBtns = document.querySelectorAll('.hub .cmp-button');

        dropdownBtns && dropdownBtns.forEach(function(dropdownBtn) {
            dropdownBtn.addEventListener('click', function(e) {
                e.preventDefault();
                closeActiveDropdowns();
                const targetDropdownBtn = e.target.closest('.hub');
                targetDropdownBtn.querySelector('.cmp-button__dropdown').classList.toggle("show");
                targetDropdownBtn.classList.toggle("active");
            });
        });

        function closeActiveDropdowns() {
            dropdownBtns && dropdownBtns.forEach(function(dropdownBtn) {
                const targetDropdownBtn = dropdownBtn.closest('.hub');
                targetDropdownBtn.querySelector('.cmp-button__dropdown').classList.remove("show");
                targetDropdownBtn.classList.remove("active");
            });
        }

        window.addEventListener("click", function(event) {
            if (!(event.target.matches('.cmp-button') || event.target.matches('.cmp-button__text') || event.target.matches('.cmp-button__icon'))) {
                const dropdowns = document.querySelectorAll(".cmp-button__dropdown");
                dropdowns && dropdowns.forEach(function(dropdown) {
                    if (dropdown.closest('.hub') && dropdown.closest('.hub').classList.contains('active')) {
                        dropdown.closest('.hub').classList.remove('active');
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

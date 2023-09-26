(function() {
    "use strict";
    function onDocumentReady() {
        const dropdownBtns = document.querySelectorAll('.dropdownbutton .cmp-button');

        dropdownBtns && dropdownBtns.forEach(function(dropdownBtn) {
            dropdownBtn.addEventListener('click', function(e) {
                e.preventDefault();
                closeActiveDropdowns();
                const targetDropdownBtn = e.target.closest('.dropdownbutton');
                targetDropdownBtn.querySelector('.cmp-button__dropdown').classList.toggle("show");
                targetDropdownBtn.classList.toggle("active");
            });
        });

        function closeHubDropdown() {
          const targetDropdownBtn = document.querySelector('.hub');
          if (targetDropdownBtn) {
            targetDropdownBtn.querySelector('.cmp-button__dropdown').classList.remove("show");
            targetDropdownBtn.classList.remove("active");
            const headerContainerEle = document.querySelector('#cmp-techdata-header');
            headerContainerEle?.classList.remove('hub-menu-active');
          }
        }

        function closeActiveDropdowns() {
            dropdownBtns && dropdownBtns.forEach(function(dropdownBtn) {
                const targetDropdownBtn = dropdownBtn.closest('.dropdownbutton');
                targetDropdownBtn.querySelector('.cmp-button__dropdown').classList.remove("show");
                targetDropdownBtn.classList.remove("active");
                closeHubDropdown();
            });
        }

        window.addEventListener("click", function(event) {
            if (!(event.target.matches('.cmp-button') || event.target.matches('.cmp-button__text') || event.target.matches('path') || event.target.matches('.cmp-button__icon'))) {
                const dropdowns = document.querySelectorAll(".cmp-button__dropdown");
                dropdowns && dropdowns.forEach(function(dropdown) {
                    if (dropdown.closest('.dropdownbutton') && dropdown.closest('.dropdownbutton').classList.contains('active')) {
                        dropdown.closest('.dropdownbutton').classList.remove('active');
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

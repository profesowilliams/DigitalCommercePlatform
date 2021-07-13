(function() {
    "use strict";
    function onDocumentReady() {
        const vendorIcons = document.querySelectorAll('.vendor-icon');
        let vendorRightSections = document.querySelectorAll('.vendor-content-section');
        vendorIcons && vendorIcons.forEach(function(icon) {
            icon && icon?.addEventListener('click',function (e) {
                const activeIcon = e.target.closest('.vendor-icon').dataset.type;
                const vendorIconsList = e.target.closest('.vendor-listing--left-section').querySelectorAll('.vendor-icon');
                vendorIconsList && vendorIconsList.forEach(function(icon) {
                    icon.querySelector('.vendor-icon__container').classList.remove('activeIcon');
                    icon.querySelector('.vendor-icon__container').classList.add('nonActiveIcon');
                });
                e.target.closest('.vendor-icon').querySelector('.vendor-icon__container').classList.add('activeIcon');
                e.target.closest('.vendor-icon').querySelector('.vendor-icon__container').classList.remove('nonActiveIcon');
                vendorRightSections = e.target.closest('.vendor-listing--container').querySelectorAll('.vendor-content-section');
                vendorRightSections && vendorRightSections.forEach(function(section) {
                    const sectionType = section.dataset.type;
                    sectionType && section.classList.remove('active');
                    if (sectionType === activeIcon) {
                        section.classList.add('active');
                    }
                });
            });
        });
    };
    document.addEventListener("DOMContentLoaded", onDocumentReady);
})();
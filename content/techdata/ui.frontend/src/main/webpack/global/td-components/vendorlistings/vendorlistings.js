(function() {
    "use strict";
    function onDocumentReady() {
        const vendorIcons = document.querySelectorAll('.vendor-icon');
        const vendorRightSections = document.querySelectorAll('.vendor-content-section');
        vendorIcons && vendorIcons.forEach(function(icon) {
            icon && icon?.addEventListener('click',function (e) {
                const activeIcon = e.target.closest('.vendor-icon').dataset.type;
                vendorIcons && vendorIcons.forEach(function(icon) {
                    icon.classList.remove('activeIcon');
                });
                e.target.closest('.vendor-icon').classList.add('activeIcon');
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
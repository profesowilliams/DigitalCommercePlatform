(function () {
    const CLASS_NOTIFICATION_CLOSE_BUTTON = 'close-notification';
    const CLASS_NOTIFICATION_ICON = 'cmp-notification_icon';
    const CLASS_NOTIFICATION_ICON_ALERT = 'cmp-notification-alert';
    const CLASS_NOTIFICATION_ICON_WARNING = 'cmp-notification-warning';
    const CLASS_NOTIFICATION_ICON_CHECK = 'cmp-notification-secondary';
    const CLASS_NOTIFICATION_ICON_INFO = 'cmp-notification-primary';

    const arrayClassElements = [
        CLASS_NOTIFICATION_ICON_ALERT,
        CLASS_NOTIFICATION_ICON_WARNING,
        CLASS_NOTIFICATION_ICON_CHECK,
        CLASS_NOTIFICATION_ICON_INFO,
    ];

    const selectHandlerClass = (classType) => {
        switch(classType){
            case CLASS_NOTIFICATION_ICON_ALERT: 
                return '/content/dam/global-shared/icons/notification/alert.svg';
            case CLASS_NOTIFICATION_ICON_WARNING: 
                return "/content/dam/global-shared/icons/notification/warning.svg";
            case CLASS_NOTIFICATION_ICON_CHECK: 
                return "/content/dam/global-shared/icons/notification/check.svg";
            case CLASS_NOTIFICATION_ICON_INFO: 
                return "/content/dam/global-shared/icons/notification/info.svg";
        }
    };

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    document.addEventListener('DOMContentLoaded', () => {
        /**
         * @type {HTMLCollectionOf<Element>[]}
         */
        const notificationElements = Array.prototype.slice.call(document.getElementsByClassName(CLASS_NOTIFICATION_ICON)); 
        notificationElements.forEach(n => {
            if (n.tagName === "SPAN" || n.tagName === "svg" || n.tagName === "img" || n.tagName  ==='IMG') {
                const parent = n.parentNode.parentNode.parentNode; // 3 parents up
                const classType = Array.prototype.slice.call(parent.classList).filter(classElement => arrayClassElements.includes(classElement))[0];
                const iconFA = n.parentNode.getAttribute('data-cmp-icon');
                const iconDAM = n.parentNode.getAttribute('data-cmp-icon-dam');
                const img = document.createElement("img");
                const iItem = document.createElement("i");
                if (iconDAM) {
                    img.src = iconDAM;
                } else if (iconFA) {
                    const arrayIcon = iconFA.split(' ');
                    arrayIcon.forEach(i => {
                        iItem.classList.add(i);
                    });
                    n.parentNode.replaceChild(iItem, n);
                    return;
                } else {
                    img.src = selectHandlerClass(classType);
                }
                img.classList.add(CLASS_NOTIFICATION_ICON);
                n.parentNode.replaceChild(img, n);
            }
        })        

        /**
         * @type {HTMLCollectionOf<Element>[]}
         */
         const closeElements = Array.prototype.slice.call(document.getElementsByClassName(CLASS_NOTIFICATION_CLOSE_BUTTON)); 
         closeElements.forEach(c => {
            const parent = c.parentNode;
            const container = parent.parentNode;
            container.addEventListener('click', () => {
                container.remove()
            }, false);
        })
    });
})();
    

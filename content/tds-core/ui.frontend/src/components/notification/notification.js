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
                return '/content/dam/global-shared/icons/Alert.svg';
            case CLASS_NOTIFICATION_ICON_WARNING: 
                return "/content/dam/global-shared/icons/Warning.svg";
            case CLASS_NOTIFICATION_ICON_CHECK: 
                return "/content/dam/global-shared/icons/Check.svg";
            case CLASS_NOTIFICATION_ICON_INFO: 
                return "/content/dam/global-shared/icons/Info.svg";
        }
    };

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const notificationElements = Array.prototype.slice.call(document.getElementsByClassName(CLASS_NOTIFICATION_ICON)); 
        notificationElements.forEach(n => {
            if (n.tagName === "SPAN" || n.tagName === "svg") {
                const parent = n.parentNode.parentNode.parentNode; // 3 parents up
                const classType = Array.prototype.slice.call(parent.classList).filter(classElement => arrayClassElements.includes(classElement))[0];
                const img = document.createElement("img");
                img.src = selectHandlerClass(classType);
                img.classList.add(CLASS_NOTIFICATION_ICON);
                n.parentNode.replaceChild(img, n);
            }
        })
        
        window.onclick = function (event) {            
            if (event.target.className === CLASS_NOTIFICATION_CLOSE_BUTTON){
              const parent = event.target.parentNode;
              const container = parent.parentNode;
              container.remove();
            }
        };
    });
})();
    

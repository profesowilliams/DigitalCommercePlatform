(function () {
    const CLASS_NOTIFICATION_CLOSE_BUTTON = 'close-notification';
    document.addEventListener('DOMContentLoaded', () => {
        window.onclick = function (event) {            
            if (event.target.className === CLASS_NOTIFICATION_CLOSE_BUTTON){
              const parent = event.target.parentNode;
              const container = parent.parentNode;
              container.parentNode;
              container.parentNode.remove();
            }
        };

    });

})();



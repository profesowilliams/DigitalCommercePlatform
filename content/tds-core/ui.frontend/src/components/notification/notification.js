(function () {
    const CLASS_NOTIFICATION_CLOSE_BUTTON = 'close-notification';
    document.addEventListener('DOMContentLoaded', () => {
        // When the user clicks anywhere outside of the notification, close it
        window.onclick = function (event) {            
            if (event.target.className === CLASS_NOTIFICATION_CLOSE_BUTTON){
              const container = event.target.parentNode;
              container.parentNode.remove();
            }
        };

    });

})();



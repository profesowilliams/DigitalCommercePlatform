export default {
    addLoginListener: (listener) => {
        window.addEventListener('user:loggedIn', () => listener(true));
        window.addEventListener('user:loggedOut', () => listener(false));
    }
};

import { nanoid } from "nanoid";

export const createSessionId = () => nanoid(16);

export const setSessionId = (sessionId) => localStorage.setItem('sessionId', sessionId);

export const getSessionId = () => localStorage.getItem('sessionId');

export const signOut = () => {
    localStorage.removeItem('signin');
    localStorage.removeItem('signout');
    localStorage.removeItem('userData');
    localStorage.removeItem('signInCode');
    window.location.href = window.location.protocol + "//" + window.location.hostname + window.location.pathname;
};

export const getUser = () => JSON.parse(localStorage.getItem("userData"));
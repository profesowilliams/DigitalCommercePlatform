import { nanoid } from "nanoid";

export const createSessionId = () => nanoid(16);

export const setSessionId = (sessionId) => localStorage.setItem('sessionId', sessionId);

export const getSessionId = () => localStorage.getItem('sessionId');
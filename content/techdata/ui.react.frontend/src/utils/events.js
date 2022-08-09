export const triggerEvent = (eventName) => {
    const event = new Event(eventName);

    window.dispatchEvent(event);
}
import { IEvent } from './../interfaces/dispatcher-interfaces';
export class DispatcherEvent implements IEvent {
    private eventName: string;
    private callbacks: Array<(data: unknown) => void>;

    constructor(eventName: string) {
        this.eventName = eventName;
        this.callbacks = [];
    }

    public registerCallback = (callback: (data: unknown) => unknown) => {
        this.callbacks.push(callback);
    }

    public unregisterCallback = (callback: (data: unknown) => unknown) => {
        const index = this.callbacks.indexOf(callback);
        if (index > -1) {
            this.callbacks.splice(index, 1);
        }
    }

    public fire = (data: unknown) => {
        const callbacks = this.callbacks.slice(0);
        callbacks.forEach((callback) => {
            try {
                callback(data);
            } catch (err) {
                const errorObject = {
                    message: 'Error while executing callback.',
                    callback,
                    data,
                    err,
                };
                console.error(errorObject);
            }
        });
    }
}

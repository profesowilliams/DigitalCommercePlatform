import { IDispatcher, IRequest, IResponse } from '../interfaces/dispatcher-interfaces';
import { DispatcherEvent } from '../models/dispatcher-event';
import { State } from '../models/state';

export class Dispatcher implements IDispatcher {
    public state: State;
    private events: object;
    constructor() {
        this.events = {};
        // here we can save state for every object that we want to keep state across current app lifecycle.
        // we can also hook into an event that will be raised on state change
        this.state = new State(this);
    }

    public UUID = (): string => {
        return ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: number) =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16),
        );
    }
    // after dispatching event
    // dispatcher don't care about listeners of this event and don't expect unknown response from receiver(s)
    public dispatch = (eventName: string, data: unknown) => {
        const event = this.events[eventName];
        if (event) {
            event.fire(data);
        }
    }
    // after sending request, dispatcher expect to receive response from receiver(s).
    // After receive response from all receivers, promise with all outputs will be resolved.
    public sendRequest = (requestName: string, data: unknown) => {
        const defer = () => {
            const deferred = {
                promise: null,
                resolve: null,
                reject: null,
            };
            deferred.promise = new Promise((resolve, reject) => {
                deferred.resolve = resolve;
                deferred.reject = reject;
            });
            return deferred;
        };

        const requestID = this.UUID();
        const output = defer();
        let receiversCount = 0;
        if (this.events[requestName] === undefined || this.events[requestName].callbacks.length === 0) {
            const message = 'No listeners for this request: ' + requestID;
            output.reject(message);
        } else {
            receiversCount = this.events[requestName].callbacks.length;
        }
        const requestCompleted = (response: IResponse) => {
            if (response.response) {
                output.resolve(response);
            } else {
                output.reject(response);
            }
        };
        const dataToSend = {
            requestData: data,
            requestID,
            requestCompleted,
        };
        const event = this.events[requestName];
        if (event) {
            event.fire(dataToSend);
        }
        return output.promise;
    }
    public on = (eventName: string, callback: (data: unknown) => unknown) => {
        let event = this.events[eventName];
        if (!event) {
            event = new DispatcherEvent(eventName);
            this.events[eventName] = event;
        }
        event.registerCallback(callback);
    }
    public off = (eventName: string, callback: (data: unknown) => unknown) => {
        const event = this.events[eventName];
        if (event && event.callbacks.indexOf(callback) > -1) {
            event.unregisterCallback(callback);
            if (event.callbacks.length === 0) {
                delete this.events[eventName];
            }
        }
    }
}

import { IDispatcher, IState } from '../interfaces/dispatcher-interfaces';

export class State implements IState {
    private states = {};
    private dispatcher: IDispatcher;

    constructor(dispatcher: IDispatcher) {
        this.dispatcher = dispatcher;
    }

    // key - object name ;
    public getState = (key: string) => {
        return this.states[key];
    }

    // key - object name ; value - object; can be used also to initialize, can override existing state
    public saveState = (key: string, value: unknown) => {
        const previousValue = this.states[key];
        const currentValue = value;
        this.states[key] = value;
        this.invokeCallback(key, previousValue, currentValue);
        return this.states[key];
    }

    // key - object name ; value - object; is not overriding existing state
    public initState = (key: string, value: unknown) => {
        if (this.states[key] === undefined) {
            this.states[key] = value || null;
        }
        return this.states[key];
    }

    private invokeCallback = (key: string, previous: unknown, current: unknown) => {
        this.dispatcher.dispatch(key, { previousState: previous, currentState: current });
    }
}

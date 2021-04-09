export interface IState {
    getState: (key: string) => unknown;
    saveState: (key: string, value: unknown) => unknown;
    initState: (key: string, value: unknown) => unknown;
}

export interface IWatchable {
    currentValue: unknown;
    previousValue: unknown;
}

export interface IDispatcher {
    state: IState;
    dispatch: (eventName: string, data: unknown) => void;
    sendRequest: (requestName: string, data: unknown) => Promise<IResponse>;
    on: (eventOrRequestName: string, callback: unknown) => void;
    off: (eventOrRequestName: string, callback: unknown) => void;
}

export interface IRequest {
    // Data that caller send to receivers and want some response from listener
    requestData: unknown;
    // UUIDv4 for this request
    requestID: string;
    // callback that will be executed by listener after executed request.
    requestCompleted: (response: IResponse) => void;
}

export interface IResponse {
    response: unknown;
    requestID: string;
    isExecutedSuccesfully: boolean;
}

export interface IEvent {
    registerCallback: (callback: (data: unknown) => unknown) => void;
    unregisterCallback: (callback: (data: unknown) => unknown) => void;
    fire: (data: unknown) => void;
}

package com.techdata.core.util.impl;

public class UIServiceException extends RuntimeException {

    public UIServiceException() {
        super();
    }

    public UIServiceException(String message) {
        super(message);
    }

    public UIServiceException(String message, Throwable cause) {
        super(message, cause);
    }

    public UIServiceException(Throwable cause) {
        super(cause);
    }

    protected UIServiceException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}

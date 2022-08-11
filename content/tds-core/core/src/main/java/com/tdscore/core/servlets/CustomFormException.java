package com.tdscore.core.servlets;

public class CustomFormException extends Exception {

    public CustomFormException() {
        super();
    }

    public CustomFormException(String message) {
        super(message);
    }

    public CustomFormException(String message, Throwable cause) {
        super(message, cause);
    }

    public CustomFormException(Throwable cause) {
        super(cause);
    }

    protected CustomFormException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}

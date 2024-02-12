package com.tdscore.core.services;

public enum IntouchRequestType {

    CSS_REQUEST(0),
    JS_REQUEST(1),
    GTM_REQUEST(2);

    private int id;
    IntouchRequestType(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }
}
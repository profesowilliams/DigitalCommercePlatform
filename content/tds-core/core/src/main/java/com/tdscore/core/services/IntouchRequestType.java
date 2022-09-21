package com.tdscore.core.services;

public enum IntouchRequestType {

    CSS_REQUEST(0),
    JS_REQUEST(1),
    HEADER_REQUEST(2),
    FOOTER_REQUEST(3);

    private int id;
    IntouchRequestType(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

}

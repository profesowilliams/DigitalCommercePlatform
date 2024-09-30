package com.tdscomponentlib.core.models;

import com.adobe.cq.wcm.core.components.commons.link.Link;

public class EnhancedListItemLink implements Link {

    protected String url;

    @Override
    public String getURL() {
        return url;
    }

    public void setURL(String url) {
        this.url = url;
    }
}

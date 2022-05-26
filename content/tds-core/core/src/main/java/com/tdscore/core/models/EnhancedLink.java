package com.tdscore.core.models;

import com.adobe.cq.wcm.core.components.commons.link.Link;

public class EnhancedLink implements Link<String> {

    public String url;


    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
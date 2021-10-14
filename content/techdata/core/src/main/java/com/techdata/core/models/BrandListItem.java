package com.techdata.core.models;

import com.adobe.cq.wcm.core.components.models.ListItem;

public class BrandListItem implements ListItem {

    protected String title;
    protected String link;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }
}

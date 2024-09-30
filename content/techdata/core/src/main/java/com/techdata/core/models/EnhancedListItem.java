package com.techdata.core.models;

import com.adobe.cq.wcm.core.components.commons.link.Link;
import com.adobe.cq.wcm.core.components.models.ListItem;

public class EnhancedListItem implements ListItem {

    protected String title;
    protected EnhancedListItemLink link = new EnhancedListItemLink();

    @Override
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public Link getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link.url = link;
    }
}

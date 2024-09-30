package com.tdscore.core.models;

import com.adobe.cq.wcm.core.components.commons.link.Link;
import com.adobe.cq.wcm.core.components.models.ListItem;

public class EnhancedListItem implements ListItem {

    protected String title;
    protected String path;
    protected EnhancedListItemLink link = new EnhancedListItemLink();

    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public String getPath() {
        return path;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public EnhancedListItemLink getLink() {
        return link;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public void setLink(String link) {
        this.link.url = link;
    }
}

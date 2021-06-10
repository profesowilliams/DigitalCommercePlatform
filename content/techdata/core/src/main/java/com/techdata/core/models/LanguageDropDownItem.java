package com.techdata.core.models;

import com.adobe.cq.wcm.core.components.models.NavigationItem;
import com.adobe.cq.wcm.core.components.models.datalayer.ComponentData;
import com.adobe.cq.wcm.core.components.models.datalayer.builder.DataLayerBuilder;
import com.adobe.cq.wcm.core.components.util.ComponentUtils;
import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;

import java.util.Calendar;
import java.util.Optional;

public class LanguageDropDownItem implements NavigationItem {

    private Page page;
    private boolean active;
    private ComponentData componentData;
    private Boolean dataLayerEnabled;
    private Resource resource;

    LanguageDropDownItem(Page page, boolean active) {
        this.page = page;
        this.active = active;
        Resource resource = page.adaptTo(Resource.class);
    }

    public void setActive(boolean active)
    {
        this.active = active;
    }

    public boolean getActive()
    {
        return this.active;
    }

    public String getLanguageDisplayText()
    {
        return this.page.getLanguage().getDisplayLanguage() + " - " + this.page.getLanguage().getLanguage().toUpperCase();
    }

    public Page getPage()
    {
        return this.page;
    }

    public String getURL()
    {
        return this.page.getPath() + ".html";
    }

    public String getLanguage() {
        return this.page.getLanguage().getLanguage();
    }

}

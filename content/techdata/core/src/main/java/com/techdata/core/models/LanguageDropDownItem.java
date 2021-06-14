package com.techdata.core.models;

import com.adobe.cq.wcm.core.components.models.NavigationItem;
import com.adobe.cq.wcm.core.components.models.datalayer.ComponentData;
import com.adobe.cq.wcm.core.components.models.datalayer.builder.DataLayerBuilder;
import com.adobe.cq.wcm.core.components.util.ComponentUtils;
import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageFilter;
import org.apache.sling.api.resource.Resource;

import java.util.*;

public class LanguageDropDownItem  {

    private Page page;
    private boolean active;
    private ComponentData componentData;
    private Boolean dataLayerEnabled;
    private String title;

    private List<LanguageDropDownItem> children;

    public String getTitle(){
        return this.title;
    }


    LanguageDropDownItem(Page page, boolean active) {
        this.page = page;
        this.active = active;
        this.title = page.getPageTitle();
    }

    LanguageDropDownItem(Page page, boolean active, int level) {
        List<LanguageDropDownItem> childPages = new ArrayList<>();
        this.page = page;
        this.active = active;
        this.title = page.getPageTitle();


        Iterator<Page> it = page.listChildren(new PageFilter());
        while (it.hasNext()) {
            Page nextPage = it.next();
            if (level - 1 > 0)
            {
                childPages.add(new LanguageDropDownItem(nextPage, active, level - 1));
            }else{
                childPages.add(new LanguageDropDownItem(nextPage, active));
            }

        }
        this.children = childPages;
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

    public String getDisplayLanguage() {
        return this.page.getLanguage().getDisplayLanguage();
    }

    public List<LanguageDropDownItem> getChildren() {
        return this.children;
    }

}

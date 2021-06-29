package com.techdata.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageFilter;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class LanguageDropDownItem  {

    private Page page;
    private boolean active;
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
        if(it != null) {
            while (it.hasNext()) {
                Page nextPage = it.next();
                if (level - 1 > 0) {
                    childPages.add(new LanguageDropDownItem(nextPage, active, level - 1));
                } else {
                    childPages.add(new LanguageDropDownItem(nextPage, active));
                }
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

    @SuppressWarnings("squid:S2384")
    public List<LanguageDropDownItem> getChildren() {
        return children;
    }

}

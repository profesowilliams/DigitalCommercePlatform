package com.techdata.core.models;

import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import com.google.gson.*;

public class SubNavLinks {
    protected static final Logger log = LoggerFactory.getLogger(SubNavLinks.class);

    public static final String JCR_CONTENT_IMAGE =  "/jcr:content/image";
    public static final String FILE =  "file";
    public static final String EXTERNAL_IMAGE_PATH = "file/jcr:content/dam:thumbnails/dam:thumbnail_48.png";
    public static final String FILE_REFERENCE_IMAGE_PATH = "/jcr:content/renditions/cq5dam.thumbnail.48.48.png";
    private static final String FONTAWESOME_ICON_PROPERTY_NAME = "pageMenuIcon";
    private static final String DEFAULT_FONT_AWESOME_ICON = "fas fa-server";

    private String pageTitle;

    private String pagePath;

    private String pageIcon;

    private Page navPage;

    private String hasChildPages;

    private String rootParentTitle;

    private List<SubNavLinks> subNavLinkslist =  new ArrayList<>();

    SubNavLinks(Page page, ResourceResolver resolver, String rootParentTitle){
        this.navPage = page;
        this.pageTitle = page.getTitle();
        this.pagePath = page.getPath();
        this.rootParentTitle = rootParentTitle;

        ValueMap pageProps = page.getProperties();
        if (pageProps.containsKey(FONTAWESOME_ICON_PROPERTY_NAME))
        {
            this.pageIcon = (String) pageProps.get(FONTAWESOME_ICON_PROPERTY_NAME);
        }

        if (this.pageIcon == null || this.pageIcon.isEmpty())
        {
            this.pageIcon = DEFAULT_FONT_AWESOME_ICON;
        }

        childPageIterator(resolver);
    }


    public String getRootParentTitle() {
        return this.rootParentTitle;
    }

    public String getPageTitle() {
        return pageTitle;
    }

    public void setPageTitle(String pageTitle) {
        this.pageTitle = pageTitle;
    }

    public String getPagePath() {
        return pagePath;
    }

    public void setPagePath(String pagePath) {
        this.pagePath = pagePath;
    }

    public String getPageIcon() {
        return pageIcon;
    }

    public void setPageIcon(String pageIcon) {
        this.pageIcon = pageIcon;
    }

    public void childPageIterator(ResourceResolver resolver){
        Iterator<Page> itr = navPage.listChildren();
        while(itr.hasNext()){
            Page childPage = itr.next();
            if(!childPage.isHideInNav()){
                hasChildPages = "true";
                SubNavLinks childNav = new SubNavLinks(childPage, resolver, this.rootParentTitle);
                subNavLinkslist.add(childNav);
            }
        }
    }

    SubNavLinks(String name, String pageUrl, String rootParentTitle, JsonArray children, String externalUrl ){
        this.pageTitle = name;
        this.pagePath = pageUrl;
        this.rootParentTitle = rootParentTitle;
        childJsonIterator(children, externalUrl);

    }

    public void childJsonIterator(JsonArray children, String externalUrl){
        Iterator<JsonElement> subNavelements = children.iterator();
        while (subNavelements.hasNext()) {
            hasChildPages = "true";
            JsonElement subNavrecordElement = subNavelements.next();
            String subNavname = subNavrecordElement.getAsJsonObject().get("name").toString().replace("\"", "");
            String subNavpageUrl = externalUrl+subNavrecordElement.getAsJsonObject().get("key").toString().replace("\"", "");
            JsonArray subNavchildren = (JsonArray) subNavrecordElement.getAsJsonObject().get("children");
            SubNavLinks quaduaryLink = new SubNavLinks(subNavname, subNavpageUrl, this.rootParentTitle, subNavchildren, externalUrl);
            this.subNavLinkslist.add(quaduaryLink);

        }
    }

    public List<SubNavLinks> getSubNavLinkslist(){
        return subNavLinkslist;
    }

    public Page getNavPage() {
        return navPage;
    }

    public void setNavPage(Page navPage) {
        this.navPage = navPage;
    }

    public String getHasChildPages() {
        return hasChildPages;
    }

    public void setHasChildPages(String hasChildPages) {
        this.hasChildPages = hasChildPages;
    }

    public String getMenuID() {
        return (this.getRootParentTitle()+"-"+this.getPageTitle()).toLowerCase(Locale.ROOT);
    }
}


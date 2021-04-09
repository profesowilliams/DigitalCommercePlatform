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


public class SubNavLinks {
    protected static final Logger log = LoggerFactory.getLogger(SubNavLinks.class);

    public static final String JCR_CONTENT_IMAGE =  "/jcr:content/image";
    public static final String FILE =  "file";
    public static final String EXTERNAL_IMAGE_PATH = "file/jcr:content/dam:thumbnails/dam:thumbnail_48.png";
    public static final String FILE_REFERENCE_IMAGE_PATH = "/jcr:content/renditions/cq5dam.thumbnail.48.48.png";

    private String pageTitle;

    private String pagePath;

    private String pageIcon;

    private Page navPage;

    private String hasChildPages;

    private List<SubNavLinks> subNavLinkslist =  new ArrayList<>();

    SubNavLinks(Page page, ResourceResolver resolver){
        this.navPage = page;
        this.pageTitle = page.getTitle();
        this.pagePath = page.getPath();
        Resource imgResource = resolver.getResource(page.getPath() + JCR_CONTENT_IMAGE);
        if(imgResource != null){
            if(imgResource.getChild(FILE) != null){
                pageIcon = imgResource.getChild(EXTERNAL_IMAGE_PATH).getPath();
            }else {
                pageIcon = imgResource.getValueMap().get("fileReference", String.class) + FILE_REFERENCE_IMAGE_PATH;
            }
        }
        childPageIterator(resolver);
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
                SubNavLinks childNav = new SubNavLinks(childPage, resolver);
                subNavLinkslist.add(childNav);
            }
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
}


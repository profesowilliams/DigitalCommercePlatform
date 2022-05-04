package com.tdscore.core.models;

import com.adobe.cq.dam.cfm.ContentFragment;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageFilter;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.tdscore.core.slingcaconfig.CatalogServiceConfiguration;
import com.tdscore.core.util.ContentFragmentHelper;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.caconfig.ConfigurationBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

import static  com.tdscore.core.util.Constants.*;

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

    private String docCount;

    private String rootParentLink;

    private List<SubNavLinks> subNavLinkslist =  new ArrayList<>();

    SubNavLinks(Page page, ResourceResolver resolver, String rootParentTitle, String rootParentLink){
        this.navPage = page;
        this.pageTitle = page.getTitle();
        this.pagePath = page.getPath();
        this.rootParentTitle = rootParentTitle;
        this.rootParentLink = rootParentLink;

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

    public SubNavLinks(Resource cfResource, String rootParentTitle, Page currentPage, String rootParentLink) {
        log.debug("inside subnavlinks constructor for CF. Path {} is being processed", cfResource.getPath());
        this.rootParentTitle = rootParentTitle;
        this.rootParentLink = rootParentLink;
        ContentFragment cf = cfResource.adaptTo(ContentFragment.class);

        populatePageData(ContentFragmentHelper.convertCFElementsToMap(cf));

//        Does CF have any children
        ResourceResolver resourceResolver = cfResource.getResourceResolver();
        Resource cfChildrenRoot = resourceResolver.getResource(cfResource.getPath() + CATALOG_CF_CHILDREN_FOLDER_SUFFIX);
        String secNavKey =
                resourceResolver.getResource(cfResource.getPath() + "/jcr:content/data/master").adaptTo(ValueMap.class).get("key", StringUtils.EMPTY);
        CatalogServiceConfiguration catalogServiceConfiguration =
                currentPage.adaptTo(ConfigurationBuilder.class).as(CatalogServiceConfiguration.class);
        this.pagePath =
                catalogServiceConfiguration.productMenuLinkPrefix() + "?cs=" + secNavKey + "&refinements=" + secNavKey;
//        The children CFs are within a folder named with suffix '-children'
        if (null != cfChildrenRoot) {
//            This CF has children
            log.debug("Children found for path {}", cfChildrenRoot.getPath());
            for(Resource child : cfChildrenRoot.getChildren()) {
                if (ContentFragmentHelper.isContentFragment(child)) {
                    this.hasChildPages = "true";
                    log.debug("processing resource at path {}", child.getPath());
                    SubNavLinks link = new SubNavLinks(child, rootParentTitle, currentPage, rootParentLink);

                    Resource masterResource = resourceResolver.getResource(child.getPath() + "/jcr:content/data/master");
                    if(masterResource != null) {
                        String keyVal = masterResource.adaptTo(ValueMap.class).get(CATALOG_JSON_KEY_FIELD_NAME, StringUtils.EMPTY);
                        String url =
                                catalogServiceConfiguration.productMenuLinkPrefix() + "?cs=" + keyVal + "&refinements=" + keyVal;
                        link.setPagePath(url);
                        this.subNavLinkslist.add(link);
                    }
                }
            }
        }// else no children for this CF
    }

    private void populatePageData(Map<String, String> map) {
        if (map.containsKey(CATALOG_OVERRIDE_NAME) && map.containsKey(CATALOG_NAME))
        {
            this.pageTitle = map.get(CATALOG_OVERRIDE_NAME).isEmpty() ? map.get(CATALOG_NAME)  : map.get( CATALOG_OVERRIDE_NAME);
            this.docCount = map.containsKey(CATALOG_DOCCOUNT) && !map.get(CATALOG_DOCCOUNT).isEmpty() ? map.get(CATALOG_DOCCOUNT) : StringUtils.EMPTY;
            this.pageIcon = map.containsKey(CATALOG_MENU_ICON) ? map.get(CATALOG_MENU_ICON) :DEFAULT_FONT_AWESOME_ICON;
            log.debug("this.pageTitle is {}", this.pageTitle);
        }else{
            this.pageTitle = CATALOG_NO_NAME;
        }
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
        Iterator<Page> itr = navPage.listChildren(new PageFilter());
        while(itr.hasNext()){
            Page childPage = itr.next();
            hasChildPages = "true";
            SubNavLinks childNav = new SubNavLinks(childPage, resolver, this.rootParentTitle, this.rootParentLink);
            subNavLinkslist.add(childNav);
        }
    }

    SubNavLinks(String name, String pageUrl, String rootParentTitle, JsonArray children, String externalUrl, String docCount ){
        this.pageTitle = name;
        this.pagePath = pageUrl;
        this.rootParentTitle = rootParentTitle;
        this.docCount = docCount;
        childJsonIterator(children, externalUrl);

    }

    public void childJsonIterator(JsonArray children, String externalUrl){
        Iterator<JsonElement> subNavelements = children.iterator();
        while (subNavelements.hasNext()) {
            hasChildPages = "true";
            JsonElement subNavrecordElement = subNavelements.next();
            String subNavname = subNavrecordElement.getAsJsonObject().get("name").toString().replace("\"", "");
            String subNavpageUrl = externalUrl+subNavrecordElement.getAsJsonObject().get("key").toString().replace("\"", "");
            String subDocCount = externalUrl+subNavrecordElement.getAsJsonObject().get("docCount").toString();
            JsonArray subNavchildren = (JsonArray) subNavrecordElement.getAsJsonObject().get("children");
            SubNavLinks quaduaryLink = new SubNavLinks(subNavname, subNavpageUrl, this.rootParentTitle, subNavchildren, externalUrl, subDocCount);
            this.subNavLinkslist.add(quaduaryLink);

        }
    }

    @SuppressWarnings("squid:S2384")
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

    public String getDocCount() {
        return docCount;
    }

    public void setHasChildPages(String hasChildPages) {
        this.hasChildPages = hasChildPages;
    }

    public String getMenuID() {return (this.getRootParentTitle()+"-"+this.getDocCount()+this.getPageTitle()).toLowerCase(Locale.ROOT); }

    public String getLevels() {
        if(this.getDocCount() == null)
            return (this.getRootParentTitle()+">"+this.getPageTitle());
        else
            return (this.getRootParentTitle()+">"+this.getDocCount()+this.getPageTitle());
    }

    public String getRootParentLink(){
        return this.rootParentLink;
    }
}


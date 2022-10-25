package com.tdscore.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageFilter;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.Template;
import com.tdscore.core.util.ContentFragmentHelper;
import lombok.Getter;
import lombok.Setter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.google.gson.JsonArray;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.*;

@Model(adaptables = {SlingHttpServletRequest.class,Resource.class},
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
@Setter
public class LinkItem {

    protected static final Logger log = LoggerFactory.getLogger(LinkItem.class);
    private static final String CATALOG_ROOT_PARENT_PATH = "/content/dam/tds-core/catalog";

    @Inject
    private String platformName;

    @Inject
    private String linkUrl;

    @Inject
    private boolean isPrivate;

    @Inject
    private boolean enableUIServiceEndPoint;

    @Inject
    private String navigationCatalogRoot;

    @Inject
    private String iconUrl;

    @Inject
    private String navigationRoot;

    @Inject
    private String linkTarget;

    @Inject
    private String displayLocationPopUp;

    @Inject
    private String enableSecondaryIcon;

    @Inject
    private String adbutlerHeading;

    @Inject
    private String adbutlerJSScript;

    @Inject
    private ResourceResolver resolver;

    @SuppressWarnings("java:S116")
    @Inject
    private String UIServiceEndPoint;

    @Inject
    private String externalUrl;

    @Inject
    private String sessionID;

    @Inject
    private String randomID;

    List<SubNavLinks> subLinks = new ArrayList<>();

    private List<SubNavLinks> tertiarySubNavLinks = new ArrayList<>();

    @PostConstruct
    protected void init(){
        if(resolver != null && navigationCatalogRoot != null){
            log.debug("UI Service enabled to generate megamenu");

            Resource cfRootParent = resolver.getResource(navigationCatalogRoot);
            Page rootPage = resolver.adaptTo(PageManager.class).getPage(navigationRoot);

            if (null != cfRootParent && null != rootPage) {
                for(Resource child : cfRootParent.getChildren()) {
                    populateTertiarySubnavLinks(child, rootPage, linkUrl);
                }
                log.debug("sublink size is {}",this.subLinks.size());
            }
        }

        if(resolver != null && navigationRoot != null){
            log.debug("page root also present. path is {}", navigationRoot);
            Page rootPage = resolver.adaptTo(PageManager.class).getPage(navigationRoot);
            if(rootPage != null){
                Iterator<Page> children = rootPage.listChildren(new PageFilter());
                while(children.hasNext()){
                    Page childPage = children.next();
                    SubNavLinks link = new SubNavLinks(childPage, resolver, platformName, linkUrl);
                    
                    if (link.getSubNavLinkslist().size() > 0) {
                        Page currentPage = resolver.adaptTo(PageManager.class).getPage(link.getPagePath());
                        if (currentPage != null && 
                            currentPage.getTemplate() != null && 
                            currentPage.getTemplate().getName().equals("tds-landing-page")) {
                            link.addSubNavLink(new SubNavLinks(
                                new StringBuilder()
                                    .append("View all ")
                                    .append(link.getPageTitle())
                                    .toString(),
                                link.getPagePath(),
                                link.getPageTitle(), 
                                new JsonArray(), 
                                link.getPagePath(), 
                                "0",
                                "true")
                            );
                        }
                    }
                    subLinks.add(link);
                    tertiarySubNavLinks.addAll(link.getSubNavLinkslist());
                }
            }
        }
    }

    private void populateTertiarySubnavLinks(Resource child, Page rootPage, String rootParentLink) {
        if (ContentFragmentHelper.isContentFragment(child)) {
            log.debug("processing resource at path {}", child.getPath());
            SubNavLinks link = new SubNavLinks(child, platformName, rootPage, rootParentLink);
            this.subLinks.add(link);
            tertiarySubNavLinks.addAll(link.getSubNavLinkslist());
        }

    }

    public String getPlatformMenuID(){
        return this.getPlatformName().toLowerCase(Locale.ROOT);
    }

    public String getMobilePlatformLevel(){
        return this.getPlatformName();
    }

    public List<SubNavLinks> getSecondaryMenuItems() {
        return this.subLinks;
    }

    public boolean getHasSecondaryMenuItems() {
        return this.subLinks!=null && !subLinks.isEmpty();
    }

    public String getAdbutlerHeading() {
        return adbutlerHeading;
    }

    public String getAdbutlerJSScript() {
        return adbutlerJSScript;
    }

    @SuppressWarnings("squid:S2384")
    public List<SubNavLinks> getTertiaryMenuItems(){
        return tertiarySubNavLinks;
    }

    public String getLinkUrl() {
        return this.linkUrl;
    }

    public String getRandomID() {
        return UUID.randomUUID().toString();
    }

    public void addSubNavLink(SubNavLinks link) {
        this.subLinks.add(link);
    }
}

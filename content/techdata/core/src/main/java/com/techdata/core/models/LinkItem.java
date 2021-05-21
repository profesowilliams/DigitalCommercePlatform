package com.techdata.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.techdata.core.util.Constants;
import com.techdata.core.util.ContentFragmentHelper;
import lombok.Getter;
import lombok.Setter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;

@Model(adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
@Setter
public class LinkItem {

    protected static final Logger log = LoggerFactory.getLogger(LinkItem.class);
    private static final String CATALOG_ROOT_PARENT_PATH = "/content/dam/techdata/catalog";

    @Inject
    private String platformName;

    @Inject
    private String linkUrl;

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
    private String enableSecondaryIcon;

    @Inject
    private ResourceResolver resolver;

    @Inject
    private String UIServiceEndPoint;

    @Inject
    private String externalUrl;

    @Inject
    private String sessionID;


    List<SubNavLinks> subLinks = new ArrayList<>();

    private List<SubNavLinks> tertiarySubNavLinks = new ArrayList<>();

    @PostConstruct
    protected void init(){
        if(resolver != null && navigationCatalogRoot != null){
            log.debug("UI Service enabled to generate megamenu");

            Resource cfRootParent = resolver.getResource(navigationCatalogRoot);
            if (null != cfRootParent)
            {
                for(Resource child : cfRootParent.getChildren())
                {
                    if (ContentFragmentHelper.isContentFragment(child))
                    {
                        log.debug("processing resource at path {}", child.getPath());
                        SubNavLinks link = new SubNavLinks(child, platformName);
                        this.subLinks.add(link);
                        for(SubNavLinks tertiaryLink : link.getSubNavLinkslist())
                        {
                            this.tertiarySubNavLinks.add(tertiaryLink);
                        }
                    }
                }

                log.debug("sublink size is {}",this.subLinks.size());
            }


        }

        if(resolver != null && navigationRoot != null){
            log.debug("page root also present. path is {}", navigationRoot);
            Page rootPage = resolver.adaptTo(PageManager.class).getPage(navigationRoot);
            if(rootPage != null){
                Iterator<Page> children = rootPage.listChildren();
                while(children.hasNext()){
                    Page childPage = children.next();
                    Resource pageResource = childPage.getContentResource();
                    SubNavLinks link = new SubNavLinks(childPage, resolver, platformName);
                    subLinks.add(link);
                    for(SubNavLinks tertiaryLink : link.getSubNavLinkslist())
                    {
                        this.tertiarySubNavLinks.add(tertiaryLink);
                    }
                }

            }
        }



    }

    public String getPlatformMenuID(){
        return this.getPlatformName().toLowerCase(Locale.ROOT);
    }

    public List<SubNavLinks> getSecondaryMenuItems() {
        return this.subLinks;
    }

    public boolean getHasSecondaryMenuItems() {
        return this.subLinks!=null && this.subLinks.size() > 0;
    }


    public List<SubNavLinks> getTertiaryMenuItems(){
        return this.tertiarySubNavLinks;
    }
}

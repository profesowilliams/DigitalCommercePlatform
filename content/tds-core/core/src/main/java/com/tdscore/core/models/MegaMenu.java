package com.tdscore.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.Template;
import lombok.Getter;
import lombok.Setter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.google.gson.JsonArray;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;

@Model(adaptables = {SlingHttpServletRequest.class, Resource.class},
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
@Setter
public class MegaMenu {

    protected static final Logger log = LoggerFactory.getLogger(MegaMenu.class);

    @ChildResource
    private Resource menuList;

    private List<LinkItem> menuLinkList = new ArrayList<>();

    @Inject
    private ResourceResolver resolver;

    @PostConstruct
    protected void initModel() {
        if (menuList != null) {
            for (Resource item : menuList.getChildren()) {
                log.debug("item is {}", item.getPath());
                LinkItem link =  item.adaptTo(LinkItem.class);

                if (link.getLinkUrl() != null && link.getHasSecondaryMenuItems()) {
                    Page currentPage = resolver.adaptTo(PageManager.class).getPage(link.getLinkUrl());
                    if (currentPage != null && currentPage.getTemplate() != null && 
                        currentPage.getTemplate().getName().equals("tds-landing-page")) {
                        SubNavLinks newLink = new SubNavLinks(
                            new StringBuilder()
                                .append("View all ")
                                .append(link.getPlatformName())
                                .toString(),
                            link.getLinkUrl(),
                            link.getPlatformName(), 
                            new JsonArray(), 
                            link.getLinkUrl(), 
                            "0" );                        
                        link.addSubNavLink(newLink);
                    }
                }

                menuLinkList.add(link);
            }
        }
    }

    public String getMessage(){
        return "hello from model" + menuLinkList.size();
    }

    @SuppressWarnings("squid:S2384")
    public List<LinkItem> getFirstLevelMenuItems() {
        return this.menuLinkList;
    }


}

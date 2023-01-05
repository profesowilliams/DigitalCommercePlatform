package com.tdscore.core.models;

import com.adobe.cq.wcm.core.components.models.datalayer.ComponentData;
import com.adobe.cq.wcm.core.components.models.datalayer.builder.DataLayerBuilder;
import com.adobe.cq.wcm.core.components.util.ComponentUtils;

import com.day.cq.i18n.I18n;
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
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.google.gson.JsonArray;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.*;

@Model(adaptables = {SlingHttpServletRequest.class, Resource.class},
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
@Setter
public class MegaMenu {

    protected static final Logger log = LoggerFactory.getLogger(MegaMenu.class);

    @Self
    private SlingHttpServletRequest request;

    @ChildResource
    private Resource menuList;

    private List<LinkItem> menuLinkList = new ArrayList<>();

    @Inject
    private ResourceResolver resolver;

    private String menuID;

    private static final String VIEW_ALL_KEY = "megamenu.common.viewAll";

    @PostConstruct
    protected void initModel() {
        if (menuList != null) {
            this.menuID = "megamenu-"+this.getRandomID();
            for (Resource item : menuList.getChildren()) {
                log.debug("item is {}", item.getPath());
                LinkItem link =  item.adaptTo(LinkItem.class);
                link.setParentID(this.menuID);

                if (link.getLinkUrl() != null && link.getHasSecondaryMenuItems()) {
                    Page currentPage = resolver.adaptTo(PageManager.class).getPage(link.getLinkUrl());
                    link.setLastModifiedDate(currentPage.getLastModified().getTime());
                    if (currentPage != null && 
                        currentPage.getProperties().get("isViewAllEnabled", "").equals("true")) {
                        I18n i18n = getI18n(currentPage);
                        String viewAllText = i18n.getVar(VIEW_ALL_KEY);
                        viewAllText = (viewAllText != null && 
                            !viewAllText.trim().isEmpty() && 
                            !viewAllText.equals(VIEW_ALL_KEY)) ? viewAllText : "View All "; 

                        link.addSubNavLink(new SubNavLinks(
                            new StringBuilder()
                                .append(viewAllText)
                                .append(link.getPlatformName())
                                .toString(),
                            link.getLinkUrl(),
                            link.getPlatformName(), 
                            new JsonArray(), 
                            link.getLinkUrl(), 
                            "0",
                            "true",
                            this.menuID,
                            currentPage.getLastModified().getTime())
                        );
                    }
                }

                menuLinkList.add(link);
            }
        }
    }

    private I18n getI18n(Page currentPage) {
        Locale pageLang = currentPage.getLanguage();
        ResourceBundle resourceBundle = this.request.getResourceBundle(pageLang);
        return new I18n(resourceBundle);
    }

    public String getRandomID() {
        return UUID.randomUUID().toString().split("-",0)[0];
    }

    public String getID() {
        return this.menuID;
    }
    public String getMessage(){
        return "hello from model" + menuLinkList.size();
    }

    @SuppressWarnings("squid:S2384")
    public List<LinkItem> getFirstLevelMenuItems() {
        return this.menuLinkList;
    }

    public ComponentData getData() {
      
        return DataLayerBuilder.forComponent()
            .withId(() -> this.getID())
            .withType(() -> "tds-site/components/megamenu/")
            .build();
        
    }
}

package com.techdata.core.models;

import lombok.Getter;
import lombok.Setter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
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

    @PostConstruct
    protected void initModel() {
        if (menuList != null) {
            for (Resource item : menuList.getChildren()) {
                log.debug("item is {}", item.getPath());
                LinkItem link =  item.adaptTo(LinkItem.class);
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

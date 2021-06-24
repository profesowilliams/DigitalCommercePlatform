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
public class LinkList {

    protected static final Logger log = LoggerFactory.getLogger(LinkList.class);

    @ChildResource
    private Resource links;

    private List<LinkItem> linkItemList = new ArrayList<>();

    @PostConstruct
    protected void initModel() {
        if (links != null) {
            for (Resource item : links.getChildren()) {
                LinkItem link =  item.adaptTo(LinkItem.class);
                linkItemList.add(link);
            }
        }
    }
}

package com.techdata.core.models;

import lombok.Getter;
import lombok.Setter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Model(adaptables = {SlingHttpServletRequest.class, Resource.class},
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
@Setter
public class SocialLinks {

    protected static final Logger log = LoggerFactory.getLogger(SocialLinks.class);

    @ChildResource
    private Resource socialLinks;

    private List<SocialLinkItem> socialLinkList = new ArrayList<>();

    @PostConstruct
    protected void initModel() {
        if (socialLinks != null) {
            for (Resource item : socialLinks.getChildren()) {
                SocialLinkItem socialLink =  item.adaptTo(SocialLinkItem.class);
                socialLinkList.add(socialLink);
            }
        }
    }
}

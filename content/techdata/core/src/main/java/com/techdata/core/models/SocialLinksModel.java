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
public class SocialLinksModel {

    protected static final Logger log = LoggerFactory.getLogger(SocialLinksModel.class);

    @ChildResource
    private Resource socialLinks;

    @ValueMapValue
    private String platformName;

    @ValueMapValue
    private String linkUrl;

    @ValueMapValue
    private String iconUrl;

    @ValueMapValue
    private String linkTarget;

    private List<SocialLinksModel> socialLinkList = new ArrayList<>();

    @PostConstruct
    protected void initModel() {
        if (socialLinks != null) {
            for (Resource item : socialLinks.getChildren()) {
                SocialLinksModel socialLink =  item.adaptTo(SocialLinksModel.class);
                socialLinkList.add(socialLink);
            }
        }
    }
}

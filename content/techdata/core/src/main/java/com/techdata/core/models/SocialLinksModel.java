package com.techdata.core.models;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techdata.core.dto.SocialLink;
import lombok.Getter;
import lombok.Setter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;

@Model(adaptables = {SlingHttpServletRequest.class, Resource.class},
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
@Setter
public class SocialLinksModel {

    protected static final Logger log = LoggerFactory.getLogger(SocialLinksModel.class);

    private static final String SOCIAL_LINKS = "socialLinks";

    @Inject
    private Resource resource;

    private List<SocialLink> socialLinkList = new ArrayList<>();

    private ObjectMapper objectMapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    @PostConstruct
    protected void initModel() {
        Resource socialLinkResource = resource.getChild(SOCIAL_LINKS);
        if (socialLinkResource != null) {
            for (Resource item : socialLinkResource.getChildren()) {
                ValueMap itemValueMap = item.getValueMap();
                SocialLink socialLink = objectMapper.convertValue(itemValueMap, SocialLink.class);
                socialLinkList.add(socialLink);
            }
        }
    }
}

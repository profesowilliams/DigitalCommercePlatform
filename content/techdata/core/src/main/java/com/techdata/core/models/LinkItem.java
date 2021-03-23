package com.techdata.core.models;

import lombok.Getter;
import lombok.Setter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;

@Model(adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
@Setter
public class LinkItem {

    protected static final Logger log = LoggerFactory.getLogger(LinkItem.class);

    @Inject
    private String platformName;

    @Inject
    private String linkUrl;

    @Inject
    private String iconUrl;

    @Inject
    private String linkTarget;

}

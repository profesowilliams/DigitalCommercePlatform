package com.tdscore.core.models;

import lombok.Getter;
import lombok.Setter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;

@Getter
@Setter
@Model(adaptables = {SlingHttpServletRequest.class, Resource.class},
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CategoriesItem {

    @Inject
    private String linkLabel;

    @Inject
    private String linkUrl;

    @Inject
    private String linkTarget;
}

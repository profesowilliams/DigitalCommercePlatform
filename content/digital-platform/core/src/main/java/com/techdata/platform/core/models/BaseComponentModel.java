package com.techdata.platform.core.models;

import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.Node;
import org.apache.sling.api.resource.Resource;

@Model(adaptables = Resource.class)
public class BaseComponentModel {
    @SlingObject
    private Resource resource;

    @Inject
    @Optional
    protected String prefix;

    @PostConstruct
    public void init() throws Exception {
        Node node = resource.adaptTo(Node.class);
        node.setProperty("id", getId());
        node.setProperty("prefix", prefix);
        node.getSession().save();
    }

    public String getId() throws Exception {
        if (prefix == null) {
            prefix = "app";
        }
        String id = prefix + "-" + String.valueOf(Math.abs(resource.getPath().hashCode() - 1));
        return id;
    }
}

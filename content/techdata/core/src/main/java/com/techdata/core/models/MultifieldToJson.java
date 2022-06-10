package com.techdata.core.models;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.RequestAttribute;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.RepositoryException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import static  com.day.cq.commons.jcr.JcrConstants.*;
import static org.apache.sling.jcr.resource.api.JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY;

@Model(adaptables = {SlingHttpServletRequest.class, Resource.class},
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class MultifieldToJson {

    private static final Logger LOGGER = LoggerFactory.getLogger(MultifieldToJson.class);

    @Optional
    @RequestAttribute
    private String name;

    @Inject
    private SlingHttpServletRequest request;

    private final List<String> propertiesToIgnore = new ArrayList<>();

    @PostConstruct
    public void init() {
        // let's test if we are getting the param in here.
        LOGGER.info("request param name :: {}", name);
        setPropertiesToIgnore();
    }

    private void setPropertiesToIgnore() {
        propertiesToIgnore.add(JCR_PRIMARYTYPE);
        propertiesToIgnore.add(SLING_RESOURCE_TYPE_PROPERTY);
        propertiesToIgnore.add(JCR_LAST_MODIFIED_BY);
        propertiesToIgnore.add(JCR_LASTMODIFIED);
        propertiesToIgnore.add(JCR_CREATED_BY);
        propertiesToIgnore.add(JCR_CREATED);
    }

    public String getJsonMulti() throws RepositoryException {
        Resource childResource = request.getResource().getChild(name); //get the root node using name
        if (childResource != null) {
            JsonObject resourceJson =   checkForChildren(childResource);
            return resourceJson.toString();
        }
        return StringUtils.EMPTY;
    }

    private JsonObject checkForChildren(Resource resource) throws RepositoryException {
        Node resNode = resource.adaptTo(Node.class);
        JsonObject resourceJson = new JsonObject();
        if (null != resNode) {
            for (PropertyIterator resProp = resNode.getProperties(); resProp.hasNext(); ) {
                Property property = resProp.nextProperty();
                if (!propertiesToIgnore.contains(property.getName()))
                    resourceJson.addProperty(property.getName(), property.getValue().getString());
            }
        }
        if (resource.hasChildren()) {
            JsonArray multiJson = new JsonArray();
            for (Iterator<Resource> children = resource.listChildren(); children.hasNext(); ) {
                Resource childResource = children.next();
                JsonObject obj = checkForChildren(childResource);
                //if resource has children, list children as json objects.
                //but for multi use JsonArray
                if (childResource.getName().startsWith("item"))
                    multiJson.add(obj);
                else
                    resourceJson.add(childResource.getName(), obj);
            }
            if (multiJson.size() > 0)
                resourceJson.add("items", multiJson);
        }
        return resourceJson;
    }

}

package com.tdscore.core.models;

import com.day.cq.wcm.api.components.ComponentContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Model(adaptables = {SlingHttpServletRequest.class, Resource.class},
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
@Setter
public class Notification {

    protected static final Logger LOG = LoggerFactory.getLogger(Notification.class);

    @Self
    private SlingHttpServletRequest request;

    @ScriptVariable(injectionStrategy = InjectionStrategy.OPTIONAL)
    private ComponentContext componentContext;

    @Inject
    private ResourceResolver resolver;

    @Self
    private Resource resource;

    public String getDataJson() {
        try {
            //Create a map of properties we want to expose
            Map<String, Object> analyticsProperties = new HashMap<>();
            DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
            ValueMap props = resource.adaptTo(ValueMap.class);
            if(props != null) {
                analyticsProperties.put("@type", resource.getResourceType());
                String strDate = dateFormat.format(props.get("jcr:lastModified", Calendar.getInstance().getTime()));
                analyticsProperties.put("repo:modifyDate", strDate);
                analyticsProperties.put("dc:title", props.get("message", StringUtils.EMPTY));
                analyticsProperties.put("dc:description", props.get("message", StringUtils.EMPTY));
                analyticsProperties.put("xdm:text", props.get("linkLabel", StringUtils.EMPTY));
                analyticsProperties.put("xdm:linkURL", props.get("linkUrl", StringUtils.EMPTY));
                String id = UUID.randomUUID().toString().split("-", 0)[0];
                analyticsProperties.put("parentId", id);

                String jsonString = String.format("{\"%s\":%s}",
                        id,
                        new ObjectMapper().writeValueAsString(analyticsProperties));
                LOG.debug("Analytics {}", jsonString);
                return jsonString;
            }
        } catch (Exception e) {
            LOG.error("Unable to generate dataLayer JSON string", e);
        }

        return null;
    }
}

package com.techdata.core.models;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.components.Component;
import com.day.cq.wcm.api.components.ComponentManager;

/**
 * Defines an {@code Editor} Sling Model used by the {@code /apps/core/wcm/components/commons/editor/dialog/childreneditor/v1/childreneditor} dialog component.
 *
 * @since com.adobe.cq.wcm.core.components.commons.editor.dialog.childreneditor 1.0.0
 */
@Model(adaptables = {SlingHttpServletRequest.class})
public class TabEditor {

    private static final Logger logger = LoggerFactory.getLogger(TabEditor.class);

    @Self
    private SlingHttpServletRequest request;

    private Resource container;

    private List<TabItem> items;

    @PostConstruct
    private void initModel() {
        readChildren();
    }

    private void readChildren() {
        items = new ArrayList<>();
        String containerPath = request.getRequestPathInfo().getSuffix();
        if (StringUtils.isNotEmpty(containerPath)) {
            ResourceResolver resolver = request.getResourceResolver();
            container = resolver.getResource(containerPath);
            if (container != null) {
                ComponentManager componentManager = request.getResourceResolver().adaptTo(ComponentManager.class);
                if (componentManager != null){
                    for (Resource resource : container.getChildren()) {
                        logger.info("resource Path from TabEditor" + resource.getPath());
                        if (resource != null) {
                            Component component = componentManager.getComponentOfResource(resource);
                            if (component != null) {
                                items.add(new TabItem(request, resource));
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Retrieves the child items associated with this children editor.
     *
     * @return a list of child items
     */
    public List<TabItem> getItems() {
        return Collections.unmodifiableList(items);
    }

    /**
     * Retrieves the container resource associated with this children editor.
     *
     * @return the container resource, or {@code null} if no container can be found
     */
    public Resource getContainer() {
        return container;
    }
}

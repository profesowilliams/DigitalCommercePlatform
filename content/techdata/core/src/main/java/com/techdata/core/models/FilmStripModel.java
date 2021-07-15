package com.techdata.core.models;

import java.util.ArrayList;
import java.util.Collection;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.via.ResourceSuperType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.wcm.core.components.models.List;
import com.adobe.cq.wcm.core.components.models.ListItem;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;

@Model(adaptables = SlingHttpServletRequest.class, adapters = List.class, resourceType = FilmStripModel.RESOURCE_TYPE)
public class FilmStripModel implements List {
	private static final Logger log = LoggerFactory.getLogger(FilmStripModel.class);

    public static final String RESOURCE_TYPE = "techdata/components/filmstrip";
    private static final String PAGE_PROPERTY_CF_PATH = "fragmentPath";
    
    @Self
    private SlingHttpServletRequest request;
    
    @Self
    @Via(type = ResourceSuperType.class)
    List delegateList;

    public Collection<ListItem> getProfileItems() {
        Collection<ListItem> listOfProfileItems = new ArrayList<>();
        Resource resource = request.getResource();
        PageManager pageManager = resource.getResourceResolver().adaptTo(PageManager.class);
        Collection<ListItem> cfProfileItems = delegateList.getListItems();
        log.debug(" Content Fragment List Item Size  {}", cfProfileItems.size());
        for (ListItem cfProfileItem : cfProfileItems) {
            log.debug("Inside CF for loop {}", cfProfileItem.getPath());
            Page page = pageManager.getPage(cfProfileItem.getPath());
            ValueMap pageMap = page.getProperties();
            if(pageMap.containsKey(PAGE_PROPERTY_CF_PATH)){
                String cfPath = pageMap.get(PAGE_PROPERTY_CF_PATH, StringUtils.EMPTY);
                log.debug(" Content Fragment Path  {}", cfPath);
                Resource cfResource = resource.getResourceResolver().getResource(cfPath);
                ContentFragment contentFragment = cfResource.adaptTo(ContentFragment.class);
                if(contentFragment != null){
                    FilmStripItem vi = FilmStripItem.getProfileListItem(contentFragment, cfProfileItem.getPath());
                    listOfProfileItems.add(vi);
                }
            }

        }
        return listOfProfileItems;
    }
}

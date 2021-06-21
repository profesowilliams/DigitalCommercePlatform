package com.techdata.core.models;
import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.dam.cfm.ContentFragmentManager;
import com.adobe.cq.wcm.core.components.models.LanguageNavigation;
import com.adobe.cq.wcm.core.components.models.ListItem;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.techdata.core.util.ContentFragmentHelper;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.via.ResourceSuperType;
import com.adobe.cq.wcm.core.components.models.List;
import com.techdata.core.models.VendorListItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import java.util.*;

@Model(adaptables = SlingHttpServletRequest.class, adapters = List.class, resourceType = VendorComponentList.RESOURCE_TYPE)
public class VendorComponentList implements List {

    private static final Logger log = LoggerFactory.getLogger(VendorComponentList.class);

    public static final String RESOURCE_TYPE = "techdata/components/vendorlistings";
    private static final String PAGE_PROPERTY_CF_PATH = "cfPath";
    @Self
    private SlingHttpServletRequest request;
    private String navigationRoot;
    private int structureDepth;

    @Self
    @Via(type = ResourceSuperType.class)
    List delegateList;


    @Override
    public Collection<ListItem> getListItems() {
        Collection<ListItem> listOfVendorItems = new ArrayList<>();
        Resource resource = request.getResource();
        PageManager pageManager = resource.getResourceResolver().adaptTo(PageManager.class);
        Collection<ListItem> cfListItems = delegateList.getListItems();
        log.debug(" Content Fragment List Item Size  = " + cfListItems.size());
        for (ListItem cfListItem : cfListItems) {
            log.debug("Inside CF for loop = " +  cfListItem.getPath());
            Page page = pageManager.getPage(cfListItem.getPath());
            ValueMap pageMap = page.getProperties();
            if(pageMap.containsKey(PAGE_PROPERTY_CF_PATH)){
                String cfPath = pageMap.get(PAGE_PROPERTY_CF_PATH, StringUtils.EMPTY);
                log.debug(" Content Fragment Path  = " + cfPath);
                Resource cfResource = resource.getResourceResolver().getResource(cfPath);
                ContentFragment contentFragment = cfResource.adaptTo(ContentFragment.class);
                if(contentFragment != null){
                    VendorListItem vi = VendorListItem.getVendorListItem(contentFragment);
                    listOfVendorItems.add(vi);
                }
            }

        }
        return listOfVendorItems;
    }
}
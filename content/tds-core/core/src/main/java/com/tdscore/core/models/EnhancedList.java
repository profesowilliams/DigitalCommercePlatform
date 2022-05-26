package com.tdscore.core.models;

import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.wcm.core.components.commons.link.Link;
import com.adobe.cq.wcm.core.components.models.List;
import com.adobe.cq.wcm.core.components.models.ListItem;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.via.ResourceSuperType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;

@Model(adaptables = SlingHttpServletRequest.class, adapters = List.class, resourceType = EnhancedList.RESOURCE_TYPE)
public class EnhancedList implements List {

    private static final Logger log = LoggerFactory.getLogger(EnhancedList.class);

    public static final String RESOURCE_TYPE = "techdata/components/enhancedlist";
    private static final String PN_VENDOR_PRODUCT_LINK = "vendor-product-link";
    private static final String PAGE_PROPERTY_CF_PATH = "cfPath";
    @Self
    private SlingHttpServletRequest request;

    @Self
    @Via(type = ResourceSuperType.class)
    List delegateList;

    @ValueMapValue(via="resource", injectionStrategy = InjectionStrategy.OPTIONAL)
    String linkItems;

    @ValueMapValue(via="resource", injectionStrategy = InjectionStrategy.OPTIONAL)
    String urlType;

    @Override
    public Collection<ListItem> getListItems() {
        Collection<ListItem> listOfBrandItems = new ArrayList<>();
        Resource resource = request.getResource();
        PageManager pageManager = resource.getResourceResolver().adaptTo(PageManager.class);
        Collection<ListItem> brandListItems = delegateList.getListItems();
        for (ListItem brandListItem : brandListItems) {
            log.debug("Inside brandListItem for loop = {}",  brandListItem.getPath());
            Page page = pageManager.getPage(brandListItem.getPath());
            ValueMap pageMap = page.getProperties();
            EnhancedListItem item = new EnhancedListItem();
            item.setTitle(page.getTitle());
            EnhancedLink pageLinK = new EnhancedLink();
            if("true".equals(linkItems) && "srpPage".equals(urlType)){
                pageLinK.setUrl(srpPageLink(pageMap, resource));
                item.setLink(pageLinK);
            } else if (linkItems.equals("true")){
                pageLinK.setUrl(page.getPath());
                item.setLink(pageLinK);
            }
            listOfBrandItems.add(item);
        }
        return listOfBrandItems;
    }

    public java.util.List<String> convertArrayToList(String[] array){
        return Arrays.asList(array);
    }

    public String srpPageLink(ValueMap pageMap, Resource resource){
        String cfPath = pageMap.get(PAGE_PROPERTY_CF_PATH, StringUtils.EMPTY);
        log.debug(" Enhancedlist Content Fragment Path  = {}", cfPath);
        Resource cfResource = resource.getResourceResolver().getResource(cfPath);
        if(cfResource != null) {
            ContentFragment contentFragment = cfResource.adaptTo(ContentFragment.class);
            if (contentFragment !=null){
                ContentElement contentElement = contentFragment.getElement(PN_VENDOR_PRODUCT_LINK);
                if(contentElement != null){
                    return contentElement.getContent();
                }
            }
        }
        return StringUtils.EMPTY;
    }
}
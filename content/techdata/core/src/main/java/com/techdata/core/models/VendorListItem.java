package com.techdata.core.models;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.wcm.core.components.models.ListItem;
import com.day.cq.tagging.TagManager;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class VendorListItem implements ListItem {

    private static final Logger log = LoggerFactory.getLogger(VendorListItem.class);

    private String title;
    private String overview;
    private String vendorIcon;
    private String pageLink;
    private String vendorPageLabel;
    private String vendorProductLabel;
    private String vendorProductLink;
    private List<String> categoryTag = new ArrayList<>();

    @Override
    public String getTitle() {
        return title;
    }
    public String getOverview() {
        return overview;
    }
    public String getVendorIcon() {
        return vendorIcon;
    }
    public String getPageLink() {
        return pageLink;
    }
    public String getVendorPageLabel() {
        return vendorPageLabel;
    }
    public String getVendorProductLabel() {
        return vendorProductLabel;
    }
    public String getVendorProductLink() {
        return vendorProductLink;
    }

    @SuppressWarnings("squid:S2384")
    public List<String> getCategoryTag() {
        return categoryTag;
    }

    public VendorListItem(){}

    @SuppressWarnings("java:S107")
    public VendorListItem(
        final String title,
        final String overview,
        final String vendorIcon,
        final String pageLink,
        final String vendorPageLabel,
        final String vendorProductLabel,
        final String vendorProductLink,
        final List<String> tags) {
        this.title = title;
        this.overview = overview;
        this.vendorIcon = vendorIcon;
        this.pageLink = pageLink;
        this.vendorPageLabel = vendorPageLabel;
        this.vendorProductLabel = vendorProductLabel;
        this.vendorProductLink = vendorProductLink;
        this.categoryTag = Collections.unmodifiableList(tags);
    }

    public static VendorListItem getVendorListItem(ContentFragment cf, Resource resource){

        String title = StringUtils.EMPTY;
        String overview = StringUtils.EMPTY;
        String vendorIcon = StringUtils.EMPTY;
        String pageLink = StringUtils.EMPTY;
        String vendorPageLabel = StringUtils.EMPTY;
        String vendorProductLabel = StringUtils.EMPTY;
        String vendorProductLink = StringUtils.EMPTY;
        List<String> tags = new ArrayList<>();


        for (Iterator<ContentElement> it = cf.getElements(); it.hasNext(); ) {
            ContentElement ce = it.next();
            String tagElement = ce.getName();
            if(tagElement.equals("vendor-name")){
                title = ce.getContent();
            }else if(tagElement.equals("overview")){
                overview = ce.getContent();
            }else if(tagElement.equals("vendor-icon")){

                vendorIcon = ce.getContent();
            }else if (tagElement.equals("vendor-page-link")){
                pageLink = ce.getContent();
            }
            else if (tagElement.equals("vendor-page-label")){
                vendorPageLabel = ce.getContent();
            }
            else if (tagElement.equals("vendor-product-label")){
                vendorProductLabel = ce.getContent();
            }
            else if (tagElement.equals("vendor-product-link")){
                vendorProductLink = ce.getContent();
            }
            else if (tagElement.equals("vendor-category")){
                tags = prepareTags(ce, resource);
            }
        }
        VendorListItem v1 = new VendorListItem(title, overview, vendorIcon, pageLink, vendorPageLabel, vendorProductLabel, vendorProductLink, tags);
        log.debug(" CF Data From Vendor List Item class = {} {}", title, overview);
        return v1;
    }

    private static List<String> prepareTags(ContentElement ce, Resource resource) {
        List<String> tags = new ArrayList<>();
        String vTags = ce.getContent();
        String[] vendorCategoryTags = vTags.split("\\r?\\n");
        log.debug(" Vendor category Tags {}", vTags);
        TagManager tagManager = resource.getResourceResolver().adaptTo(TagManager.class);
        for(int i = 0; i < vendorCategoryTags.length; i++){
            log.debug(" Inside for loop {}", vendorCategoryTags[i]);
            String tag = tagManager.resolve(vendorCategoryTags[i]).getTitle();
            log.debug(" Vendor category Tag Name {}", tag);
            if(tag != null){tags.add(tag);}
        }
        return tags;
    }
}
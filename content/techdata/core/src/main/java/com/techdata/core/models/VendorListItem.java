package com.techdata.core.models;

import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.wcm.core.components.models.ListItem;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Iterator;

public class VendorListItem implements ListItem {

    private static final Logger log = LoggerFactory.getLogger(VendorListItem.class);

    private String title;
    private String overview;
    private String vendorIcon;
    private String pageLink;
    private String vendorPageLabel;
    private String vendorProductLabel;
    private String vendorProductLink;


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

    public VendorListItem(){}

    public VendorListItem(String title, String overview, String vendorIcon, String pageLink, String vendorPageLabel, String vendorProductLabel, String vendorProductLink) {
        this.title = title;
        this.overview = overview;
        this.vendorIcon = vendorIcon;
        this.pageLink = pageLink;
        this.vendorPageLabel = vendorPageLabel;
        this.vendorProductLabel = vendorProductLabel;
        this.vendorProductLink = vendorProductLink;
    }

    public static VendorListItem getVendorListItem(ContentFragment cf){

        String title = StringUtils.EMPTY;
        String overview = StringUtils.EMPTY;
        String vendorIcon = StringUtils.EMPTY;
        String pageLink = StringUtils.EMPTY;
        String vendorPageLabel = StringUtils.EMPTY;
        String vendorProductLabel = StringUtils.EMPTY;
        String vendorProductLink = StringUtils.EMPTY;


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
        }
        VendorListItem v1 = new VendorListItem(title, overview, vendorIcon, pageLink, vendorPageLabel, vendorProductLabel, vendorProductLink);
        log.debug(" CF Data From Vendor List Item class = {} {}", title, overview);
        return v1;
    }
}
package com.techdata.core.models;


import com.adobe.cq.wcm.core.components.models.ListItem;
import com.day.cq.commons.jcr.JcrConstants;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

public class TDListItem extends VendorListItem  {

    private static final String PAGE_THUMBNAIL_NODENAME = "image";
    private static final String PAGE_THUMBNAIL_FILE_NODE_NAME = "image/file";
    private static final String FILE_REFERENCE_RENDITION_PATH = "/jcr:content/renditions/cq5dam.thumbnail.140.100.png";
    private static final String TAG_CATEGORY_PN = "tagCategories";

    private static final Logger log = LoggerFactory.getLogger(TDListItem.class);

    private boolean isIconSVG;
    private ListItem listItem;
    private String[] dropdownCategoryTags;

    public TDListItem(String title, String overview,String vendorIcon, String pageLink, String vendorPageLabel, String vendorProductLabel, String vendorProductLink, List<String> tags, ListItem listItem) {
        super(title, overview, vendorIcon, pageLink, vendorPageLabel, vendorProductLabel, vendorProductLink, tags, listItem);
        this.listItem = listItem;
    }

    @Override
    public String getURL() {
        return listItem.getURL();
    }

    @Override
    public String getTitle() {
        return listItem.getTitle();
    }

    @Override
    public String getDescription() {
        return listItem.getDescription();
    }

    @Override
    public Calendar getLastModified() {
        return listItem.getLastModified();
    }

    @Override
    public String getPath() {
        return listItem.getPath();
    }

    @Override
    public String getName() {
        return listItem.getName();
    }

    public boolean getIsIconSVG() {
        return isIconSVG;
    }

    public String getDropdownCategoryTags() { return String.join(",",this.dropdownCategoryTags); }

    public static TDListItem getTDListItem(Resource pageContentResource, ListItem listItem){
        String title = pageContentResource.getValueMap().containsKey(JcrConstants.JCR_TITLE) ? pageContentResource.getValueMap().get(JcrConstants.JCR_TITLE, StringUtils.EMPTY) : StringUtils.EMPTY;
        String overview = StringUtils.EMPTY;
        String vendorIcon = StringUtils.EMPTY;
        String pageLink = StringUtils.EMPTY;
        String vendorPageLabel = StringUtils.EMPTY;
        String vendorProductLabel = StringUtils.EMPTY;
        String vendorProductLink = StringUtils.EMPTY;
        boolean isIconSVG = false;
        List<String> tags = new ArrayList<>();
        String[] dropdownCategorytags;


        Resource pageImageFileNodeResource = pageContentResource.getChild(PAGE_THUMBNAIL_FILE_NODE_NAME);
        Resource pageImageResource = pageContentResource.getChild(PAGE_THUMBNAIL_NODENAME);
        ValueMap pageValuemap = pageContentResource.getValueMap();

        if (pageValuemap.containsKey(TAG_CATEGORY_PN)){
            dropdownCategorytags = pageValuemap.get(TAG_CATEGORY_PN, String[].class);
            log.debug("tags found in page at {}. Tags are {}", pageContentResource.getPath(), (dropdownCategorytags == null ? "tags is null" : String.join(",", dropdownCategorytags)));
        }else{
            dropdownCategorytags = new String[0];
        }

        //          The thumbnail is from dam via fileReferenceProperty
        if (pageImageFileNodeResource == null && pageImageResource != null) {
            ExtractSVGModel evg = pageImageResource.adaptTo(ExtractSVGModel.class);
            if (evg != null)
            {
                vendorIcon = evg.isSvg() ? evg.getBinary() : (evg.getPath() + FILE_REFERENCE_RENDITION_PATH);
            }else{
                vendorIcon = "<svg>error</svg>";
            }
            isIconSVG = evg != null && evg.isSvg();
        }

        TDListItem tdListItem =  new TDListItem(title, overview, vendorIcon, pageLink, vendorPageLabel, vendorProductLabel, vendorProductLink, tags, listItem);
        tdListItem.setIconSVG(isIconSVG);
        tdListItem.setDropdownCategoryTags(dropdownCategorytags);
        return tdListItem;
    }

    public void setIconSVG(boolean iconSVG) {
        isIconSVG = iconSVG;
    }

    @SuppressWarnings("java:S2384")
    public void setDropdownCategoryTags(String[] dropdownCategoryTags) {
        this.dropdownCategoryTags = dropdownCategoryTags.clone();
    }
}
package com.techdata.core.models;

import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.wcm.core.components.models.ListItem;
import com.day.cq.tagging.TagManager;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

public class TDListItem extends VendorListItem  {

    private static final String PAGE_THUMBNAIL_NODENAME = "image";
    private static final String PAGE_THUMBNAIL_FILE_NODE_NAME = "image/file";
    private static final String FILE_REFERENCE_IMAGE_PATH = "/jcr:content/renditions/cq5dam.thumbnail.140.100.png";
    private static final String EXTERNAL_IMAGE_PATH = "/file/jcr:content/dam:thumbnails/dam:thumbnail_48.png";
    private static final String THUMBNAIL_FOLDER = "image/file/jcr:content/dam:thumbnails";
    private static final String FILE_REFERENCE = "fileReference";
    public static final String RESOURCE_TYPE = "techdata/components/list";

    private static final Logger log = LoggerFactory.getLogger(TDListItem.class);

    private String title;
    private String overview;
    private String vendorIcon;
    private String pageLink;
    private String vendorPageLabel;
    private String vendorProductLabel;
    private String vendorProductLink;
    private boolean isIconSVG;
    private List<String> categoryTag = new ArrayList<>();

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
    public boolean getIsIconSVG() {
        return isIconSVG;
    }

    @SuppressWarnings("squid:S2384")
    public List<String> getCategoryTag() {
        return categoryTag;
    }

    public TDListItem(){}

    @SuppressWarnings("java:S107")
    public TDListItem(
        final String title,
        final String overview,
        final String vendorIcon,
        final String pageLink,
        final String vendorPageLabel,
        final String vendorProductLabel,
        final String vendorProductLink,
        final List<String> tags,
        final boolean isIconSVG) {
        this.title = title;
        this.vendorIcon = vendorIcon;
        this.pageLink = pageLink;
        this.vendorPageLabel = vendorPageLabel;
        this.vendorProductLabel = vendorProductLabel;
        this.vendorProductLink = vendorProductLink;
        this.categoryTag = Collections.unmodifiableList(tags);
        this.isIconSVG = isIconSVG;
    }

    public static TDListItem getTDListItem(Resource pageContentResource){
        log.debug("inside getTDListItem");
        String title = pageContentResource.getValueMap().containsKey("jcr:title") ? pageContentResource.getValueMap().get("jcr:title", StringUtils.EMPTY) : StringUtils.EMPTY;
        String overview = StringUtils.EMPTY;
        String vendorIcon = StringUtils.EMPTY;
        String pageLink = StringUtils.EMPTY;
        String vendorPageLabel = StringUtils.EMPTY;
        String vendorProductLabel = StringUtils.EMPTY;
        String vendorProductLink = StringUtils.EMPTY;
        boolean isIconSVG = false;
        List<String> tags = new ArrayList<>();

        Resource pageThumbnailFolderResource = pageContentResource.getChild(THUMBNAIL_FOLDER);
        Resource pageImageFileNodeResource = pageContentResource.getChild(PAGE_THUMBNAIL_FILE_NODE_NAME);
        Resource pageImageResource = pageContentResource.getChild(PAGE_THUMBNAIL_NODENAME);
        if (pageImageFileNodeResource == null)
        {
//          The thumbnail is from dam via fileReferenceProperty
            vendorIcon = "fileReference Property";
            log.debug("vendorIcon is {}", vendorIcon);
            if (pageImageResource != null)
            {
                ExtractSVGModel evg = pageImageResource.adaptTo(ExtractSVGModel.class);
                vendorIcon = evg != null ? (evg.isSvg() ? evg.getBinary() : evg.getPath() + FILE_REFERENCE_IMAGE_PATH ) : "";
                isIconSVG = evg != null ? evg.isSvg() : false;
                log.debug("is extracct svg null or is svg? {}", evg == null ? "wvg null" : evg.isSvg());
            }



        }else if (pageThumbnailFolderResource == null){
//           The thumbnail is via an svg
            isIconSVG = true;
            vendorIcon = "is svgg";

        }else{
            vendorIcon = "is not svg. prob png";
        }

        TDListItem v1 = new TDListItem(title, overview, vendorIcon, pageLink, vendorPageLabel, vendorProductLabel, vendorProductLink, tags, isIconSVG);
        log.debug(" CF Data From Vendor List Item class = title = {}, overview = {}", title, overview);
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
package com.tdssite.core.models;

import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.wcm.core.components.models.ListItem;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.Rendition;
import com.day.cq.tagging.TagManager;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.*;

import static com.tdssite.core.util.Constants.*;

public class VendorListItem implements ListItem {

    private static final Logger log = LoggerFactory.getLogger(VendorListItem.class);
    private static final String ASSET_RENDITION_TYPE = "original";

    private String overview;
    private String vendorIcon;
    private String pageLink;
    private String vendorPageLabel;
    private String vendorProductLabel;
    private String vendorProductLink;
    private List<String> categoryTag = new ArrayList<>();
    private String vendorTitle;
    private ListItem listItem;


    @Override
    public String getURL() {
        return listItem.getURL();
    }

    @Override
    public String getTitle() {
        return this.vendorTitle;
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

    @SuppressWarnings({"java:S107", "java:S5361"})
    public VendorListItem(
            final String title,
            final String overview,
            final String vendorIcon,
            final String pageLink,
            final String vendorPageLabel,
            final String vendorProductLabel,
            final String vendorProductLink,
            final List<String> tags,
            final ListItem listItem) {
        this.overview = overview;
        this.vendorIcon = vendorIcon.replaceAll("ZZ", "\"");
        this.pageLink = pageLink;
        this.vendorPageLabel = vendorPageLabel;
        this.vendorProductLabel = vendorProductLabel;
        this.vendorProductLink = vendorProductLink;
        this.categoryTag = Collections.unmodifiableList(tags);
        this.listItem = listItem;
        this.vendorTitle = title;
    }

    @SuppressWarnings("java:S5361")
    public static VendorListItem getVendorListItem(ContentFragment cf, Resource resource, ListItem cfListItem, String vendorDescriptionType){

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
            switch (tagElement) {
                case VENDOR_NAME:
                    title = ce.getContent().replaceAll("ZZ", "\"").replaceAll("£", ",");
                    break;
                case OVERVIEW:
                    overview = ce.getContent().replaceAll("ZZ", "\"").replaceAll("£", ",");
                    break;
                case VENDOR_ICON:
                    vendorIcon = ce.getContent().replaceAll("ZZ", "\"");
                    break;
                case VENDOR_PAGE_LINK:
                    pageLink = ce.getContent();
                    break;
                case VENDOR_PAGE_LABEL:
                    vendorPageLabel = ce.getContent().replaceAll("ZZ", "\"").replaceAll("£", ",");
                    break;
                case VENDOR_PRODUCT_LABEL:
                    vendorProductLabel = ce.getContent().replaceAll("ZZ", "\"");
                    break;
                case VENDOR_PRODUCT_LINK:
                    vendorProductLink = ce.getContent();
                    break;
                case VENDOR_CATEGORY:
                    tags = prepareTags(ce, resource);
                    break;
            }
        }

        overview = getVendorDescriptionType(vendorDescriptionType, cf, overview);
        if(vendorIcon.startsWith("/content")){
            vendorIcon = getSvgToPlainText(vendorIcon, resource);
        }

        VendorListItem v1 = new VendorListItem(title, overview, vendorIcon, pageLink, vendorPageLabel, vendorProductLabel, vendorProductLink, tags, cfListItem);
        log.debug(" CF Data From Vendor List Item class = {} {}", title, overview);
        return v1;
    }

    private static String getVendorDescriptionType(String textType, ContentFragment cf, String overview){
        if(textType !=null && !textType.isEmpty()){
            String vendorTextType = textType.trim();
            ContentElement contentElement = cf.getElement(vendorTextType);
            if(contentElement != null){
                return contentElement.getContent();
            }
        }
        return overview;
    }

    private static List<String> prepareTags(ContentElement ce, Resource resource) {
        List<String> tags = new ArrayList<>();
        String vTags = ce.getContent();
        String[] vendorCategoryTags = vTags.split("\\r?\\n");
        log.debug(" Vendor category Tags {}", vTags);
        TagManager tagManager = resource.getResourceResolver().adaptTo(TagManager.class);
        for (String vendorCategoryTag : vendorCategoryTags) {
            log.debug(" Inside for loop {}", vendorCategoryTag);
            if(!vendorCategoryTag.isEmpty()){
                String tag = tagManager.resolve(vendorCategoryTag).getTitle();
                log.debug(" Vendor category Tag Name {}", tag);
                if (tag != null) {
                    tags.add(tag);
                }
            }
        }
        return tags;
    }

    private static String getSvgToPlainText(String svgPath, Resource resource){
        String plainText = StringUtils.EMPTY;
        if(!svgPath.isEmpty() && resource != null){
            Resource svgResource = resource.getResourceResolver().getResource(svgPath);
            Asset asset = svgResource.adaptTo(Asset.class);
            if(null == asset){
                return StringUtils.EMPTY;
            }
            Rendition rendition = (asset.getRendition(ASSET_RENDITION_TYPE) != null) ?
                    asset.getRendition(ASSET_RENDITION_TYPE) :
                    asset.getOriginal();

            StringWriter writer = new StringWriter();
            try {
                IOUtils.copy(rendition.getStream(), writer, StandardCharsets.UTF_8);
                plainText = writer.toString();
                log.debug("SVG Plain Text: {}", plainText);
            } catch (IOException e) {
                log.error("Error reading rendition: {}", rendition.getPath(), e);
            }
        }
        return  plainText;
    }
}
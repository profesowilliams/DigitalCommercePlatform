package com.techdata.core.models;


import com.day.cq.commons.jcr.JcrConstants;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

public class TDListItem extends VendorListItem  {

    private static final String PAGE_THUMBNAIL_NODENAME = "image";
    private static final String PAGE_THUMBNAIL_FILE_NODE_NAME = "image/file";
    private static final String FILE_REFERENCE_RENDITION_PATH = "/jcr:content/renditions/cq5dam.thumbnail.140.100.png";

    private static final Logger log = LoggerFactory.getLogger(TDListItem.class);

    private boolean isIconSVG;


    public TDListItem() {

    }

    public boolean getIsIconSVG() {
        return isIconSVG;
    }


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
        super(title, overview, vendorIcon, pageLink, vendorPageLabel, vendorProductLabel, vendorProductLink, tags);
        log.info("TDListItem contructor");
        this.isIconSVG = isIconSVG;
    }

    public static TDListItem getTDListItem(Resource pageContentResource){
        String title = pageContentResource.getValueMap().containsKey(JcrConstants.JCR_TITLE) ? pageContentResource.getValueMap().get(JcrConstants.JCR_TITLE, StringUtils.EMPTY) : StringUtils.EMPTY;
        String overview = StringUtils.EMPTY;
        String vendorIcon = StringUtils.EMPTY;
        String pageLink = StringUtils.EMPTY;
        String vendorPageLabel = StringUtils.EMPTY;
        String vendorProductLabel = StringUtils.EMPTY;
        String vendorProductLink = StringUtils.EMPTY;
        boolean isIconSVG = false;
        List<String> tags = new ArrayList<>();

        Resource pageImageFileNodeResource = pageContentResource.getChild(PAGE_THUMBNAIL_FILE_NODE_NAME);
        Resource pageImageResource = pageContentResource.getChild(PAGE_THUMBNAIL_NODENAME);
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

        return new TDListItem(title, overview, vendorIcon, pageLink, vendorPageLabel, vendorProductLabel, vendorProductLink, tags, isIconSVG);
    }

}
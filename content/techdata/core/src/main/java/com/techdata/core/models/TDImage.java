package com.techdata.core.models;

import com.adobe.cq.wcm.core.components.models.Image;
import com.adobe.cq.wcm.core.components.models.ImageArea;
import com.drew.lang.annotations.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.via.ResourceSuperType;

@Model(adaptables = {SlingHttpServletRequest.class, Resource.class}, adapters = Image.class, resourceType = TDImage.RESOURCE_TYPE)
public class TDImage implements Image {

    private static final String SVG_EXTENSTION = ".svg";

    public static final String RESOURCE_TYPE = "techdata/components/image";

    @Self
    private SlingHttpServletRequest request;

    @Self
    @Via(type = ResourceSuperType.class)
    Image image;

    @Override
    public String getSrc() {
        return image.getSrc();
    }

    /**
     * If component is teaser then populate title from component dialog
     * else
     * populate from DAM else from component dialog
     * @return
     */
    public String getAnalyticsTitle() {
        String analyticsTitle = "undefined";
        String resourceName = request.getResource().getName();
        if(resourceName.startsWith("teaser")) {
            analyticsTitle = getPropertyValue("jcr:title", analyticsTitle);
        } else if(resourceName.startsWith("image")) {
            analyticsTitle = getPropertyValue("alt", analyticsTitle);
            String fileRef = image.getFileReference();
            if(fileRef != null) {
                Resource damImageResource = request.getResourceResolver().getResource(fileRef);
                if(damImageResource != null) {
                    Resource damImageMetadataResource = damImageResource.getChild("jcr:content/metadata");
                    if(damImageMetadataResource != null && damImageMetadataResource.adaptTo(ValueMap.class) != null) {
                        analyticsTitle = damImageMetadataResource.adaptTo(ValueMap.class).get("dc:title", analyticsTitle);
                    }
                }
            }
        }
        return analyticsTitle;
    }

    public String getPropertyValue(String propName, String defaultValue) {
        String value = defaultValue;
        ValueMap props = request.getResource().adaptTo(ValueMap.class);
        if(props != null) {
            value = props.get(propName, defaultValue);
        }
        return value;
    }

    @Override
    public String getAlt() {
        String fileRef = image.getFileReference();
        String altText = image.getAlt()==null ? "undefined" : image.getAlt();
        if(fileRef != null) {
            Resource damImageResource = request.getResourceResolver().getResource(fileRef);
            if(damImageResource != null) {
                Resource damImageMetadataResource = damImageResource.getChild("jcr:content/metadata");
                if(damImageMetadataResource != null && damImageMetadataResource.adaptTo(ValueMap.class) != null) {
                    altText = damImageMetadataResource.adaptTo(ValueMap.class).get("dc:title", altText);
                }
            }
        }
        return altText;
    }
    @Override
    public String getTitle() {
        return image.getTitle();
    }
    @Override
    public String getUuid() {
        return image.getUuid();
    }
    @Override
    public String getLink() {
        return image.getLink();
    }
    @Override
    public boolean displayPopupTitle() {
        return image.displayPopupTitle();
    }
    @Override
    @JsonIgnore
    public String getFileReference() {
        return image.getFileReference();
    }

    public boolean isSVG() { return image.getSrc().endsWith(SVG_EXTENSTION); }

    public String getSvg() {
        Resource imageResource = request.getResource();
        ExtractSVGModel extractSVGModel = imageResource.adaptTo(ExtractSVGModel.class);
        return (extractSVGModel!=null ? extractSVGModel.getBinary() : "<svg></svg>");
    }

    /** @deprecated */
    @Deprecated
    @JsonIgnore
    @Override
    public String getJson() {
        return image.getJson();
    }

    @NotNull
    @Override
    public int[] getWidths() {
        return image.getWidths();
    }
    @Override
    public String getSrcUriTemplate() {
        return image.getSrcUriTemplate();
    }
    @Override
    public boolean isLazyEnabled() {
        return image.isLazyEnabled();
    }
    @Override
    public int getLazyThreshold() {
        return image.getLazyThreshold();
    }
    @Override
    public java.util.List<ImageArea> getAreas() {
        return image.getAreas();
    }

    @NotNull
    @Override
    public String getExportedType() {
        return image.getExportedType();
    }
    @Override
    public boolean isDecorative() {
        return image.isDecorative();
    }
    @Override
    public String getSmartCropRendition() {
        return image.getSmartCropRendition();
    }
    @Override
    public boolean isDmImage() {
        return image.isDmImage();
    }

}

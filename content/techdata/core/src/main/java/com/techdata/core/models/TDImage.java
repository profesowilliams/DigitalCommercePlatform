package com.techdata.core.models;

import com.adobe.cq.wcm.core.components.models.Image;
import com.adobe.cq.wcm.core.components.models.ImageArea;
import com.drew.lang.annotations.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
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

    @Override
    public String getAlt() {
        return  image.getAlt() + "-TD";
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

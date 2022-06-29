package com.tdscore.core.models;

import com.adobe.cq.wcm.core.components.models.Image;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class TDImageTest {
    TDImage tdImage;
    @Mock
    Resource resource, damImageResource;
    @Mock
    SlingHttpServletRequest request;
    @Mock
    ResourceResolver resourceResolver;
    @Mock
    ValueMap baseProps;
    @Mock
    Image image;
    ExtractSVGModel extractSVGModel;
    private final static String src = "src";
    @BeforeEach
    void setUp() {
        tdImage = new TDImage();
        Field requestField = null;
        try {
            requestField = tdImage.getClass().getDeclaredField("request");
            requestField.setAccessible(true);
            requestField.set(tdImage, request);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }
        try {
            requestField = tdImage.getClass().getDeclaredField("image");
            requestField.setAccessible(true);
            requestField.set(tdImage, image);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }
        Mockito.lenient().when(request.getResource()).thenReturn(resource);
        Mockito.lenient().when(request.getResourceResolver()).thenReturn(resourceResolver);
        Mockito.lenient().when(resource.getPath()).thenReturn("/content/image");
        Mockito.lenient().when(resourceResolver.getResource("/content/image")).thenReturn(resource);
        Mockito.lenient().when(resource.adaptTo(ValueMap.class)).thenReturn(baseProps);
    }

    @Test
    void testgetAnalyticsTitleTeaser(){
        when(resource.getName()).thenReturn("teaser");
        when(baseProps.get("jcr:title", "undefined")).thenReturn("teaser");
        assertEquals("teaser",tdImage.getAnalyticsTitle());
    }
    @Test
    void testgetAnalyticsTitleImage(){
        when(resource.getName()).thenReturn("image");
        when(baseProps.get("alt", "undefined")).thenReturn("image");
        when(image.getFileReference()).thenReturn("/content/dam/file");
        when(resourceResolver.getResource("/content/dam/file")).thenReturn(damImageResource);
        when(damImageResource.getChild("jcr:content/metadata")).thenReturn(resource);
        when(baseProps.get("dc:title","image")).thenReturn("image");
        assertEquals("image",tdImage.getAnalyticsTitle());
    }
    @Test
    void testgetPropertyValue(){
        when(baseProps.get("test1","test2")).thenReturn("test2");
        assertEquals("test2",tdImage.getPropertyValue("test1","test2"));
    }
    @Test
    void testgetAlt(){
        when(image.getFileReference()).thenReturn("/content/dam/file");
        when(resourceResolver.getResource("/content/dam/file")).thenReturn(damImageResource);
        when(damImageResource.getChild("jcr:content/metadata")).thenReturn(resource);
        when(baseProps.get("dc:title","undefined")).thenReturn("image");
        assertEquals("image",tdImage.getAlt());
    }
    @Test
    void testGetSrc(){
        when(image.getSrc()).thenReturn(src);
        assertEquals(src,tdImage.getSrc());
    }
    @Test
    void testgetTitle(){
        when(image.getTitle()).thenReturn(src);
        assertEquals(src,tdImage.getTitle());
    }
    @Test
    void testgetUuid(){
        when(image.getUuid()).thenReturn(src);
        assertEquals(src,tdImage.getUuid());
    }
    @Test
    void testgetLink(){
        when(image.getLink()).thenReturn(src);
        assertEquals(src,tdImage.getLink());
    }
    @Test
    void testdisplayPopupTitle(){
        when(image.displayPopupTitle()).thenReturn(true);
        assertTrue(tdImage.displayPopupTitle());
    }
    @Test
    void testgetFileReference(){
        when(image.getFileReference()).thenReturn(src);
        assertEquals(src,tdImage.getFileReference());
    }
    @Test
    void testgetSvg(){
        when(resource.adaptTo(ExtractSVGModel.class)).thenReturn(extractSVGModel);
        assertEquals("<svg></svg>",tdImage.getSvg());
    }
    @Test
    void testgetSrcUriTemplate(){
        when(image.getSrcUriTemplate()).thenReturn(src);
        assertEquals(src,tdImage.getSrcUriTemplate());
    }
    @Test
    void testisLazyEnabled(){
        when(image.isLazyEnabled()).thenReturn(true);
        assertTrue(tdImage.isLazyEnabled());
    }
    @Test
    void testgetLazyThreshold(){
        when(image.getLazyThreshold()).thenReturn(1);
        assertEquals(1,tdImage.getLazyThreshold());
    }
    @Test
    void testgetExportedType(){
        when(image.getExportedType()).thenReturn(src);
        assertEquals(src,tdImage.getExportedType());
    }
    @Test
    void testgetSmartCropRendition(){
        when(image.getSmartCropRendition()).thenReturn(src);
        assertEquals(src,tdImage.getSmartCropRendition());
    }
    @Test
    void testisDmImage(){
        when(image.isDmImage()).thenReturn(true);
        assertTrue(tdImage.isDmImage());
    }
    @Test
    void testisDecorative(){
        when(image.isDecorative()).thenReturn(true);
        assertTrue(tdImage.isDecorative());
    }
}

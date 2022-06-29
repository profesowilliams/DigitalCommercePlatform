package com.tdscore.core.models;

import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.Rendition;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.InputStream;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class ExtractSVGModelTest {

    @InjectMocks
    ExtractSVGModel extractSVGModel;

    @Mock
    Asset asset;

    @Mock
    Rendition rendition;

    @Mock
    InputStream stream;

    @Mock
    ValueMap valueMap;

    @Mock
    Resource imageResource;

    @Mock
    ResourceResolver resolver;

    @BeforeEach
    void setUp() {
        assertNotNull(asset);
    }

    @Test
    void testisSvg(){
        when(asset.getPath()).thenReturn("/content/dam/image.svg");
        extractSVGModel.isSvg();
    }

    @Test
    void testgetBinary(){
        when(asset.getOriginal()).thenReturn(rendition);
        when(rendition.getStream()).thenReturn(stream);
        extractSVGModel.getBinary();
    }
    @Test
    void testgetOverlaySVGBinary(){
        extractSVGModel.getOverlaySVGBinary();
    }

    @Test
    void testInit(){
        Mockito.lenient().when(imageResource.getValueMap()).thenReturn(valueMap);
        Mockito.lenient().when(valueMap.get("fileReference", String.class)).thenReturn("image.svg");
        Mockito.lenient().when(imageResource.getResourceResolver()).thenReturn(resolver);
        Mockito.lenient().when(resolver.getResource("/content/dam/image.svg")).thenReturn(imageResource);
        Mockito.lenient().when(imageResource.adaptTo(Asset.class)).thenReturn(asset);
        extractSVGModel.init();
    }
}

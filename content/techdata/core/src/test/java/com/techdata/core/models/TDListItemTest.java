package com.techdata.core.models;

import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import com.day.cq.commons.jcr.JcrConstants;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.testing.resourceresolver.MockResource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Iterator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class TDListItemTest {

    @Mock
    private Resource resource;

    @Mock
    private Resource imageResource;

    @Mock
    private ExtractSVGModel extractSVGModel;

    @Mock
    ValueMap vm;


    private static final String PAGE_THUMBNAIL_NODENAME = "image";
    private static final String PAGE_THUMBNAIL_FILE_NODE_NAME = "image/file";
    private static final String FILE_REFERENCE_IMAGE_PATH = "/jcr:content/renditions/cq5dam.thumbnail.140.100.png";
    private static final String THUMBNAIL_FOLDER = "image/file/jcr:content/dam:thumbnails";

    @BeforeEach
    void setUp() {

        when(resource.getValueMap()).thenReturn(vm);
        when(vm.containsKey(JcrConstants.JCR_TITLE)).thenReturn(true);
    }

    @Test
    void getVendorListItemVendorIconWhenNotConfigured() {
        String returnValue = "";
        when(resource.getChild(PAGE_THUMBNAIL_NODENAME)).thenReturn(null);
        when(resource.getChild(PAGE_THUMBNAIL_FILE_NODE_NAME)).thenReturn(null);
        TDListItem tdl = TDListItem.getTDListItem(resource);
        assertEquals(returnValue, tdl.getVendorIcon());

    }

    @Test
    void getVendorListItemVendorIcon() {
        String returnValue = "<svg></svg>";
        when(imageResource.adaptTo(ExtractSVGModel.class)).thenReturn(extractSVGModel);
        when(resource.getChild(PAGE_THUMBNAIL_NODENAME)).thenReturn(imageResource);
        when(resource.getChild(PAGE_THUMBNAIL_FILE_NODE_NAME)).thenReturn(null);
        when(extractSVGModel.getBinary()).thenReturn(returnValue);
        when(extractSVGModel.isSvg()).thenReturn(true);
        TDListItem tdl = TDListItem.getTDListItem(resource);
        assertEquals(returnValue, tdl.getVendorIcon());

    }

    @Test
    void getVendorListItemTitle() {
        String returnValue = "title";
        when(vm.get(JcrConstants.JCR_TITLE, StringUtils.EMPTY)).thenReturn(returnValue);
        TDListItem tdl = TDListItem.getTDListItem(resource);
        assertEquals(returnValue, tdl.getTitle());

    }
}
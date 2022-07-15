package com.tdscomponentlib.core.models;

import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.wcm.core.components.models.ListItem;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;
import java.util.Iterator;

import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class VendorListItemTest {

    private VendorListItem underTest;

    @Mock
    private ContentFragment contentFragment;

    @Mock
    private Resource resource;

    @Mock
    private ContentElement ce;

    @Mock
    private Iterator<ContentElement> iteratorMock;

    @Mock
    ListItem listItem;

    @BeforeEach
    void setUp() {
        underTest =  new VendorListItem();

        when(contentFragment.getElements()).thenReturn(iteratorMock);
        when(iteratorMock.hasNext()).thenReturn(Boolean.TRUE, Boolean.FALSE);
        when(iteratorMock.next()).thenReturn(ce);

    }

    @Test
    void getVendorListItemVendorName() {
        String returnValueName = "vendor-name";
        String returnValueTitle = "ce-content";
        when(ce.getName()).thenReturn(returnValueName);
        when(ce.getContent()).thenReturn(returnValueTitle);
        VendorListItem v1 = VendorListItem.getVendorListItem(contentFragment, resource, listItem, StringUtils.EMPTY);
        assertEquals(returnValueTitle, v1.getTitle());
    }

    @Test
    void getVendorListItemOverview() {
        when(ce.getName()).thenReturn("overview");
        when(ce.getContent()).thenReturn("ce-content");
        VendorListItem v1 = VendorListItem.getVendorListItem(contentFragment, resource, listItem, StringUtils.EMPTY);
        assertEquals("ce-content", v1.getOverview());
    }

    /*
    @Test
    void getVendorListItemVendorIcon() {
        when(ce.getName()).thenReturn("vendor-icon");
        when(ce.getContent()).thenReturn("ce-content");
        VendorListItem v1 = VendorListItem.getVendorListItem(contentFragment, resource, listItem, StringUtils.EMPTY);
        assertEquals("ce-content", v1.getVendorIcon());
    }*/

    @Test
    void getVendorListItemVendorPageLink() {
        when(ce.getName()).thenReturn("vendor-page-link");
        when(ce.getContent()).thenReturn("ce-content");
        VendorListItem v1 = VendorListItem.getVendorListItem(contentFragment, resource, listItem, StringUtils.EMPTY);
        assertEquals("ce-content", v1.getPageLink());
    }

    @Test
    void getVendorListItemVendorPageLabel() {
        when(ce.getName()).thenReturn("vendor-page-label");
        when(ce.getContent()).thenReturn("ce-content");
        VendorListItem v1 = VendorListItem.getVendorListItem(contentFragment, resource, listItem, StringUtils.EMPTY);
        assertEquals("ce-content", v1.getVendorPageLabel());
    }
}
package com.techdata.core.models;

import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Iterator;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class VendorListItemTest {

    private VendorListItem vendorListItem;

    @Mock
    private ContentFragment contentFragment;

    @Mock
    private Resource resource;

    @Mock
    private ContentElement ce;

    @Mock
    private Iterator<ContentElement> iteratorMock;

    @BeforeEach
    void setUp() {
        vendorListItem =  new VendorListItem();
        when(contentFragment.getElements()).thenReturn(iteratorMock);
        when(iteratorMock.hasNext()).thenReturn(Boolean.TRUE, Boolean.FALSE);
        when(iteratorMock.next()).thenReturn(ce);
    }

    @Test
    void getVendorListItemVendorName() {

        when(ce.getName()).thenReturn("vendor-name");
        when(ce.getContent()).thenReturn("ce-content");
        VendorListItem v1 = VendorListItem.getVendorListItem(contentFragment, resource);
        assertEquals("ce-content", v1.getTitle());
    }

    @Test
    void getVendorListItemOverview() {
        when(ce.getName()).thenReturn("overview");
        when(ce.getContent()).thenReturn("ce-content");
        VendorListItem v1 = VendorListItem.getVendorListItem(contentFragment, resource);
        assertEquals("ce-content", v1.getOverview());
    }

    @Test
    void getVendorListItemVendorIcon() {
        when(ce.getName()).thenReturn("vendor-icon");
        when(ce.getContent()).thenReturn("ce-content");
        VendorListItem v1 = VendorListItem.getVendorListItem(contentFragment, resource);
        assertEquals("ce-content", v1.getVendorIcon());
    }

    @Test
    void getVendorListItemVendorPageLink() {
        when(ce.getName()).thenReturn("vendor-page-link");
        when(ce.getContent()).thenReturn("ce-content");
        VendorListItem v1 = VendorListItem.getVendorListItem(contentFragment, resource);
        assertEquals("ce-content", v1.getPageLink());
    }

    @Test
    void getVendorListItemVendorPageLabel() {
        when(ce.getName()).thenReturn("vendor-page-label");
        when(ce.getContent()).thenReturn("ce-content");
        VendorListItem v1 = VendorListItem.getVendorListItem(contentFragment, resource);
        assertEquals("ce-content", v1.getVendorPageLabel());
    }
}
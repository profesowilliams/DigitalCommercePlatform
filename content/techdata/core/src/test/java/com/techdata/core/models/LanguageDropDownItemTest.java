package com.techdata.core.models;

import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.Rendition;
import com.day.cq.wcm.api.Page;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.InputStream;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class LanguageDropDownItemTest {

    private LanguageDropDownItem underTest;

    @Mock
    private Page page;

    @Mock
    private Iterator<Page> iteratorMock;

    @Mock
    Resource resource;

    @Mock
    ResourceResolver resolver;

    @Mock
    Asset asset;

    @Mock
    Rendition rendition;

    @Mock
    InputStream inputstream;

    @BeforeEach
    void setUp() {
    }

    @Test
    void LanguageDropDownItemTest() {
        when(page.listChildren(any())).thenReturn(iteratorMock);
        when(iteratorMock.hasNext()).thenReturn(Boolean.FALSE);
        when(page.getPageTitle()).thenReturn("Page Title");
        when(page.getName()).thenReturn("345");
        when(page.getContentResource()).thenReturn(resource);
        when(page.getContentResource().getResourceResolver()).thenReturn(resolver);
        when(resolver.getResource("/content/dam/techdata/country-flags/345.svg")).thenReturn(resource);
        when(resource.adaptTo(Asset.class)).thenReturn(asset);
        when(asset.getOriginal()).thenReturn(rendition);
        when(rendition.getStream()).thenReturn(inputstream);
        underTest = new LanguageDropDownItem(page, Boolean.TRUE, 4);
        assertEquals(0, underTest.getChildren().size());
        assertEquals(page, underTest.getPage());
        assertEquals(Boolean.TRUE, underTest.getActive());
        assertEquals("Page Title", underTest.getTitle());
    }
}
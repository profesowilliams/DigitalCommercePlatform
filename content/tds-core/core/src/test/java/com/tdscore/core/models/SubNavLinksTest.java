package com.tdscore.core.models;

import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import com.day.cq.wcm.api.Page;
import com.google.gson.*;
import com.tdscore.core.slingcaconfig.CatalogServiceConfiguration;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.caconfig.ConfigurationBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;
import java.util.Iterator;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class SubNavLinksTest {
    SubNavLinks subNavLinks;
    @Mock
    Resource cfResource;
    @Mock
    Page currentPage,navPage;
    @Mock
    ResourceResolver resolver;
    @Mock
    ContentFragment cf;
    @Mock
    Iterator<ContentElement> it;
    @Mock
    ContentElement ce;
    @Mock
    ValueMap valueMap;
    @Mock
    CatalogServiceConfiguration catalogServiceConfiguration;
    @Mock
    ConfigurationBuilder configurationBuilder;
    @Mock
    Iterator<JsonElement> subNavelements;
    @BeforeEach
    void setUp() {
        when(cfResource.adaptTo(ContentFragment.class)).thenReturn(cf);
        when(cf.getElements()).thenReturn(it);
        when(it.hasNext()).thenReturn(true,false);
        when(it.next()).thenReturn(ce);
        when(ce.getName()).thenReturn("Mock");
        when(ce.getContent()).thenReturn("Mock");
        when(cfResource.getResourceResolver()).thenReturn(resolver);
        when(cfResource.getPath()).thenReturn("content/tdscore");
        when(resolver.getResource("content/tdscore-children")).thenReturn(cfResource);
        when(resolver.getResource("content/tdscore" + "/jcr:content/data/master")).thenReturn(cfResource);
        when(cfResource.adaptTo(ValueMap.class)).thenReturn(valueMap);
        when(valueMap.get("key","")).thenReturn("value");
        when(currentPage.adaptTo(ConfigurationBuilder.class)).thenReturn(configurationBuilder);
        when(configurationBuilder.as(CatalogServiceConfiguration.class)).thenReturn(catalogServiceConfiguration);
        subNavLinks = new SubNavLinks(cfResource,"Mock",currentPage,"Mock");
        Field requestField = null;
        try {
            requestField = subNavLinks.getClass().getDeclaredField("navPage");
            requestField.setAccessible(true);
            requestField.set(subNavLinks, navPage);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }
    }

    @Test
    void testchildJsonIterator(){
        String JSON_TEST_DATA = "{\n" +
                "\t\"key\": \"2\",\n" +
                "\t\"name\": \"tdscore\",\n" +
                "\t\"docCount\": \"3\",\n" +
                "\t\"children\": []\n" +
                "}";
        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(JSON_TEST_DATA, JsonObject.class);
        JsonArray jsonArray = new JsonArray();
        jsonArray.add(jsonObject);
        subNavLinks.childJsonIterator(jsonArray,"www.tdscore.com");
    }
    @Test
    void togetHasChildPages(){
        subNavLinks.setHasChildPages("child");
        assertEquals("child",subNavLinks.getHasChildPages());
    }
    @Test
    void testgetRootParentLink(){
        assertEquals("Mock",subNavLinks.getRootParentLink());
    }
    @Test
    void testgetHasChildPages(){
        subNavLinks.setHasChildPages("child");
        assertEquals("child",subNavLinks.getHasChildPages());
    }
    @Test
    void testgetPageIcon(){
        subNavLinks.setPageIcon("icon");
        assertEquals("icon",subNavLinks.getPageIcon());
    }
    @Test
    void testgetPagePath(){
        assertEquals("null?cs=value&refinements=value",subNavLinks.getPagePath());
    }
    @Test
    void testgetPageTitle(){
        assertEquals("No name in Catalog",subNavLinks.getPageTitle());
    }
    @Test
    void testgetRootParentTitle(){
        assertEquals("Mock",subNavLinks.getRootParentTitle());
    }
}


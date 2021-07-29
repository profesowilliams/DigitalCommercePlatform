package com.techdata.core.services.impl;

import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.dam.cfm.ContentFragmentException;
import com.adobe.cq.dam.cfm.FragmentTemplate;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.WCMException;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.techdata.core.util.Constants;
import com.techdata.core.util.UIServiceHelper;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.ModifiableValueMap;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.lang.reflect.Field;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class VendorServiceAPIImplTest {

    private VendorServiceAPIImpl underTest;

    @Mock
    private UIServiceHelper uiServiceHelper;

    @Mock
    private ResourceResolver resourceResolver, resourceResolverForPage;

    @Mock
    private Resource contentFragmentRootResource, template, cfmResource, masterResource, contentResource, containerResource, testResource;

    @Mock
    private FragmentTemplate fragmentTemplate;

    @Mock
    private ModifiableValueMap map, vendorPageContentResourceProps;

    @Mock
    private PageManager pageManager;

    @Mock
    private Page vendorPage;

    @Mock
    private ContentFragment cfm;

    @BeforeEach
    void setUp() {
        underTest = new VendorServiceAPIImpl();
        Field rootPagePathField;
        try {
            rootPagePathField = underTest.getClass().getDeclaredField("rootPagePath");
            rootPagePathField.setAccessible(true);
            rootPagePathField.set(underTest, ROOT_PAGE_PATH);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }

        Field contentFragmentPathField;
        try {
            contentFragmentPathField = underTest.getClass().getDeclaredField("contentFragmentPath");
            contentFragmentPathField.setAccessible(true);
            contentFragmentPathField.set(underTest, CF_PATH);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }

        Field importAPIField;
        try {
            importAPIField = underTest.getClass().getDeclaredField("importAPI");
            importAPIField.setAccessible(true);
            importAPIField.set(underTest, API_URL);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }

        Field uiServiceHelperField;
        try {
            uiServiceHelperField = underTest.getClass().getDeclaredField("uiServiceHelper");
            uiServiceHelperField.setAccessible(true);
            uiServiceHelperField.set(underTest, uiServiceHelper);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }
    }

    @Test
    void testFetchDataFromAPI() throws ContentFragmentException, WCMException, IOException {
        String title = "Acer";
        String name = "acer";
        JsonObject testJsonData = new JsonParser().parse(TEST_JSON_DATA_STR).getAsJsonObject();
        when(uiServiceHelper.getVendorDataFromAEM(API_URL, resourceResolver)).thenReturn(testJsonData);
        when(resourceResolver.getResource(CF_PATH)).thenReturn(contentFragmentRootResource);
        when(resourceResolver.getResource(Constants.VENDOR_CF_MODEL_PATH)).thenReturn(template);
        when(template.adaptTo(FragmentTemplate.class)).thenReturn(fragmentTemplate);
        when(fragmentTemplate.createFragment(contentFragmentRootResource, name, title)).thenReturn(cfm);
        when(cfm.getElements()).thenReturn(null);
        when(cfm.adaptTo(Resource.class)).thenReturn(cfmResource);
        when(cfmResource.getChild("jcr:content/data/master")).thenReturn(masterResource);
        when(masterResource.adaptTo(ModifiableValueMap.class)).thenReturn(map);
        when(masterResource.getResourceResolver()).thenReturn(resourceResolverForPage);
        when(resourceResolverForPage.adaptTo(PageManager.class)).thenReturn(pageManager);
        when(pageManager.create(ROOT_PAGE_PATH, name, "/conf/techdata/settings/wcm/templates/vendor-page", title)).thenReturn(vendorPage);
        when(vendorPage.getContentResource()).thenReturn(contentResource);
        when(contentResource.getChild("root/container")).thenReturn(containerResource);
        when(contentResource.adaptTo(ModifiableValueMap.class)).thenReturn(vendorPageContentResourceProps);
        when(resourceResolverForPage.create(any(), any(), any())).thenReturn(testResource);
        Assertions.assertEquals(1, underTest.fetchDataFromAPI(resourceResolver));
    }

    private static final String TEST_JSON_DATA_STR = "{\n" +
            "        \"content\": {\n" +
            "            \"items\": [\n" +
            "        {\n" +
            "            \"vendor-name\": \"Acer\",\n" +
            "                \"vendor-title\": \"Acer\",\n" +
            "                \"vendor-abbreviation\": \"acer\",\n" +
            "                \"vendor-designation\": \"TRUE\",\n" +
            "                \"overview\": \"<h1>Lorem ipsum</h1>\",\n" +
            "                \"vendor-icon\": \"svg:blah\",\n" +
            "                \"Solutions\": \"experience-fragments:variation/web,experience-fragments:variation/pinterest\",\n" +
            "                \"vendor-category\": \"properties:orientation/square,properties:orientation/portrait\",\n" +
            "                \"vendor-product-label\": \"Browse Products by Acer\",\n" +
            "                \"vendor-product-link\": \"shop-url\"\n" +
            "        }]}}";

    private static final String CF_PATH = "/content/dam/techdata/tech-data-dot-com/global/content-fragments/vendors";
    private static final String ROOT_PAGE_PATH = "/content/techdata/language-masters/en/vendors";
    private static final String API_URL = "http://localhost:3000/vendors";

}
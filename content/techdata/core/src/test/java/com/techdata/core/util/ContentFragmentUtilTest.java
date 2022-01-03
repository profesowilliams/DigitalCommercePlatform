package com.techdata.core.util;

import acscommons.com.google.common.reflect.TypeToken;
import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.dam.cfm.ContentFragmentException;
import com.adobe.cq.dam.cfm.FragmentTemplate;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.PersistenceException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Iterator;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class ContentFragmentUtilTest {

    private ContentFragmentUtil contentFragmentUtil;

    @Mock
    ResourceResolver resourceResolver;

    @Mock
    Resource resource,parentResource;

    @Mock
    Session session;

    @Mock
    FragmentTemplate fragmentTemplate;

    @Mock
    ContentFragment contentFragment;

    @Mock
    Iterator<ContentElement> contentElementIterator;

    @Mock
    ContentElement contentElement;

    @BeforeEach
    void setUp() {
        contentFragmentUtil = new ContentFragmentUtil();
    }

    @Test
    void processSyncContentFragmentsTest() throws PersistenceException, RepositoryException, ContentFragmentException {
        String JSON_TEST_DATA = "{\n" +
                "\t\"children\": [{}],\n" +
                "\t\"key\": \"key1\",\n" +
                "\t\"name\": \"name1\"\n" +
                "}";
        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(JSON_TEST_DATA, JsonObject.class);
        JsonArray jsonArray = new JsonArray();
        jsonArray.add(jsonObject);
        when(resourceResolver.getResource(Constants.TECHDATA_CONTENT_PAGE_ROOT)).thenReturn(resource);
        when(resourceResolver.getResource(Constants.CATALOG_CF_MODEL_PATH)).thenReturn(resource);
        when(resource.adaptTo(FragmentTemplate.class)).thenReturn(fragmentTemplate);
        when(fragmentTemplate.createFragment(resource,"key1","name1")).thenReturn(contentFragment);
        when(contentFragment.getElements()).thenReturn(contentElementIterator);
        when(contentElementIterator.hasNext()).thenReturn(true,false);
        when(contentElementIterator.next()).thenReturn(contentElement);
        when(contentElement.getName()).thenReturn("key");
        when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
        when(session.nodeExists("/content/techdata/key1-children")).thenReturn(true);
        contentFragmentUtil.processSyncContentFragments(jsonArray,Constants.TECHDATA_CONTENT_PAGE_ROOT,resourceResolver);
    }
}

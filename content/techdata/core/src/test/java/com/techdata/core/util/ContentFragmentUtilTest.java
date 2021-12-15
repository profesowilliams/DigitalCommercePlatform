package com.techdata.core.util;

import acscommons.com.google.common.reflect.TypeToken;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class ContentFragmentUtilTest {

    private ContentFragmentUtil contentFragmentUtil;

    @Mock
    ResourceResolver resourceResolver;

    @Mock
    Resource resource;

    @Mock
    Session session;

    @Mock
    FragmentTemplate fragmentTemplate;

    @Mock
    ContentFragment contentFragment;

    @BeforeEach
    void setUp() {
        contentFragmentUtil = new ContentFragmentUtil();
    }

    @Test
    void processSyncContentFragmentsTest() throws PersistenceException, RepositoryException, ContentFragmentException {
         String JSON_TEST_DATA = "{\"TestValue\": {\n" +
                "        \"key1\": 1,\n" +
                "        \"key2\": 2\n" +
                "      }}";
        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(JSON_TEST_DATA, JsonObject.class);
        JsonObject supplyPrice = jsonObject.get("TestValue").getAsJsonObject();
        Type type = new TypeToken<HashMap<String, Double>>() {
        }.getType();
        HashMap<String, Double> parsedJson = gson.fromJson(supplyPrice, type);
        JsonArray jsonArray = new JsonArray();
        for(String key : parsedJson.keySet()) {
            JsonObject jo = new JsonObject();
            jo.addProperty("key", key);
            jo.addProperty("name", parsedJson.get(key));
            jsonArray.add(jo);
        }
        JsonObject result = new JsonObject();
        result.add("TestValue", jsonArray.getAsJsonArray());
        when(resourceResolver.getResource(Constants.TECHDATA_CONTENT_PAGE_ROOT)).thenReturn(resource);
        when(resourceResolver.getResource(Constants.CATALOG_CF_MODEL_PATH)).thenReturn(resource);
        when(resource.adaptTo(FragmentTemplate.class)).thenReturn(fragmentTemplate);
        when(fragmentTemplate.createFragment(resource,"key1","1.0")).thenReturn(contentFragment);
        when(fragmentTemplate.createFragment(resource,"key2","2.0")).thenReturn(contentFragment);
        contentFragmentUtil.processSyncContentFragments(jsonArray,Constants.TECHDATA_CONTENT_PAGE_ROOT,resourceResolver);
    }
}

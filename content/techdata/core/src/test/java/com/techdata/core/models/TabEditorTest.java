package com.techdata.core.models;

import com.day.cq.wcm.api.components.Component;
import com.day.cq.wcm.api.components.ComponentManager;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.request.RequestPathInfo;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;

import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class TabEditorTest {
    TabEditor tabEditor;
    @Mock
    SlingHttpServletRequest request;
    @Mock
    Resource resource;
    @Mock
    RequestPathInfo requestpathInfo;
    @Mock
    ResourceResolver resolver;
    @Mock
    ComponentManager componentManager;
    @Mock
    Component component;
    @BeforeEach
    void setUp() {
        tabEditor = new TabEditor();
        Field requestField = null;
        try {
            requestField = tabEditor.getClass().getDeclaredField("request");
            requestField.setAccessible(true);
            requestField.set(tabEditor, request);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }
    }

    @Test
    void testreadChildren(){
        when(request.getRequestPathInfo()).thenReturn(requestpathInfo);
        when(requestpathInfo.getSuffix()).thenReturn(".html");
        when(request.getResourceResolver()).thenReturn(resolver);
        when(resolver.getResource(".html")).thenReturn(resource);
        when(resolver.adaptTo(ComponentManager.class)).thenReturn(componentManager);
        Mockito.lenient().when(componentManager.getComponentOfResource(resource)).thenReturn(component);
        tabEditor.initModel();
    }
}
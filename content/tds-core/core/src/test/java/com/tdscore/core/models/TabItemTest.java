package com.tdscore.core.models;

import com.day.cq.wcm.api.components.Component;
import com.day.cq.wcm.api.components.ComponentManager;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;

import static com.tdscore.core.models.TabItem.PN_ICON;
import static com.tdscore.core.models.TabItem.PN_PANEL_TITLE;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class TabItemTest {

    private TabItem underTest;

    @Mock
    private SlingHttpServletRequest request;

    @Mock
    private Resource resource;

    @Mock
    private ResourceResolver resolver;

    @Mock
    private ComponentManager componentManager;

    @Mock
    private Component component;

    @Mock
    private Resource compRes, pngRes, svgRes;

    @Mock
    private ValueMap vm1, vm2 ;

    @BeforeEach
    void setUp() {
        underTest = new TabItem();
        Field iconAbbreviationField = null;
        try {
            iconAbbreviationField = underTest.getClass().getDeclaredField("iconAbbreviation");
            iconAbbreviationField.setAccessible(true);
            iconAbbreviationField.set(underTest, "iconAbbreviationValue");
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }
    }

    @Test
    void TabItemTest() {
        when(resource.getName()).thenReturn("name");
        when(resource.getValueMap()).thenReturn(vm1);
        when(vm1.get(PN_PANEL_TITLE, String.class)).thenReturn("title");
        when(vm1.get("link", String.class)).thenReturn("link");
        when(vm1.get("linkPath", String.class)).thenReturn("linkPath");
        when(request.getResourceResolver()).thenReturn(resolver);
        when(resolver.adaptTo(ComponentManager.class)).thenReturn(componentManager);
        when(componentManager.getComponentOfResource(resource)).thenReturn(component);
        when(component.getTitle()).thenReturn("component-title");
        when(component.adaptTo(Resource.class)).thenReturn(compRes);
        when(compRes.getValueMap()).thenReturn(vm2);
        when(vm2.get(PN_ICON, String.class)).thenReturn(null);
        underTest = new TabItem(request, resource);
        assertEquals("co", underTest.getIconAbbreviation());
        assertEquals("name", underTest.getName());
        assertEquals("title", underTest.getValue());
        assertEquals("component-title", underTest.getTitle());
        assertEquals("link", underTest.getLink());
        assertEquals("linkPath", underTest.getLinkPath());
        assertNull(underTest.getIconPath());
        assertNull(underTest.getIconName());
    }
}
package com.techdata.core.models;


import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class LinkItemTest {
    private final AemContext context = new AemContext();

    private LinkItem underTest;

    @Mock
    private Iterable<Resource> iterable;

    @Mock
    private ResourceResolver resolver;

    private String UIServiceEndPoint;
    private String externalUrl;
    private String sessionID;

    @BeforeEach
    void setUp() {
        underTest =  new LinkItem();

        Field resolverField = null;
        try {
            resolverField = underTest.getClass().getDeclaredField("resolver");
            resolverField.setAccessible(true);
            resolverField.set(underTest, resolver);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }
        Field field = null;
        try {
            field = underTest.getClass().getDeclaredField("platformName");
            field.setAccessible(true);
            field.set(underTest, "Products");
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }

        Field field2 = null;
        try {
            field2 = underTest.getClass().getDeclaredField("linkUrl");
            field2.setAccessible(true);
            field2.set(underTest, "#");
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }
        Field field3 = null;
        try {
            field3 = underTest.getClass().getDeclaredField("enableUIServiceEndPoint");
            field3.setAccessible(true);
            field3.set(underTest, true);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }

        Field field4 = null;
        try {
            field4 = underTest.getClass().getDeclaredField("navigationCatalogRoot");
            field4.setAccessible(true);
            field4.set(underTest, "/content/dam/techdata/catalog/ALT-children");
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }

        Field field5 = null;
        try {
            field5 = underTest.getClass().getDeclaredField("iconUrl");
            field5.setAccessible(true);
            field5.set(underTest, "/path/to/icon");
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }
        Field field6 = null;
        try {
            field6 = underTest.getClass().getDeclaredField("navigationRoot");
            field6.setAccessible(true);
            field6.set(underTest, "/content/techdata/language-masters/en/products");
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }

        Field field7 = null;
        try {
            field7 = underTest.getClass().getDeclaredField("linkTarget");
            field7.setAccessible(true);
            field7.set(underTest, "true");
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }

        Field field8 = null;
        try {
            field8 = underTest.getClass().getDeclaredField("enableSecondaryIcon");
            field8.setAccessible(true);
            field8.set(underTest, "true");
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }
        Field field9 = null;
        try {
            field9 = underTest.getClass().getDeclaredField("adbutlerHeading");
            field9.setAccessible(true);
            field9.set(underTest, "Adbutler Heading");
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }
        Field field10 = null;
        try {
            field10 = underTest.getClass().getDeclaredField("adbutlerJSScript");
            field10.setAccessible(true);
            field10.set(underTest, "Adbutler Javascript Text");
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }
    }

    @Test
    void validateProperties() {
        assertEquals("Adbutler Heading", underTest.getAdbutlerHeading());
        assertEquals("Adbutler Javascript Text", underTest.getAdbutlerJSScript());
        assertEquals("true", underTest.getEnableSecondaryIcon());
        assertEquals("/content/dam/techdata/catalog/ALT-children", underTest.getNavigationCatalogRoot());
        assertEquals("Products", underTest.getPlatformName());
        assertEquals("/content/techdata/language-masters/en/products", underTest.getNavigationRoot());
        assertEquals("#", underTest.getLinkUrl());
        assertEquals("true", underTest.getLinkTarget());
    }
}

package com.techdata.core.models;

import com.adobe.cq.wcm.core.components.models.NavigationItem;
import com.day.cq.wcm.api.Page;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class LanguageNavigationImplTest {
    LanguageNavigationImpl languageNavigation;

    List<NavigationItem> items = new ArrayList<>();

    NavigationItem item;

    @Mock
    Page currentPage, parentPage;

    @BeforeEach
    void setUp() {
        languageNavigation = new LanguageNavigationImpl();
        Field requestField = null;
        try {
            requestField = LanguageNavigationImpl.class.getDeclaredField("item");
            requestField.setAccessible(true);
            requestField.set(languageNavigation, item);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }
        try {
            requestField = LanguageNavigationImpl.class.getDeclaredField("items");
            requestField.setAccessible(true);
            requestField.set(languageNavigation, items);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }
        Field requestFieldcurrentPage = null;
        try {
            requestFieldcurrentPage = LanguageNavigationImpl.class.getDeclaredField("currentPage");
            requestFieldcurrentPage.setAccessible(true);
            requestFieldcurrentPage.set(languageNavigation, currentPage);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }
    }
    @Test
    void testgetNavItems(){
        languageNavigation.getNavItems(items);
    }
    @Test
    void testgetLocalePageTitle(){
        when(currentPage.getAbsoluteParent(0)).thenReturn(parentPage);
        when(parentPage.getTitle()).thenReturn("techdata");
        assertEquals("TECHDATA", languageNavigation.getLocalePageTitle());
    }
    @Test
    void testgetLanguageItems(){
        languageNavigation.getLanguageItems();
    }
    @Test
    void testgetCountriesListItems(){
        languageNavigation.getCountriesListItems();
    }
}
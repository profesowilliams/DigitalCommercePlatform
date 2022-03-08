package com.techdata.core.models;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.lang.reflect.Field;
import java.util.Iterator;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import org.apache.sling.api.resource.ValueMap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class LanguageDropDownModelTest {

    private LanguageDropDownModel underTest;

    @Mock
    private Page currentPage, navPage, parentPage;

    @Mock
    private Iterator<Page> iteratorMock;

    @Mock
    private PageManager pageManager;

    private String navigationRoot;

    @Mock
    ValueMap valueMap;

    @BeforeEach
    void setUp() {
        underTest = new LanguageDropDownModel();
        Field navigationRootField = null;
        try {
            navigationRootField = underTest.getClass().getDeclaredField("navigationRoot");
            navigationRootField.setAccessible(true);
            navigationRootField.set(underTest, navigationRoot);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }

        Field currentPageField = null;
        try {
            currentPageField = underTest.getClass().getDeclaredField("currentPage");
            currentPageField.setAccessible(true);
            currentPageField.set(underTest, currentPage);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }
    }

    @Test
    void getRegionListItemsTest() {
        when(currentPage.getPageManager()).thenReturn(pageManager);
        when(currentPage.getDepth()).thenReturn(8);
        when(pageManager.getPage(navigationRoot)).thenReturn(navPage);
        when(navPage.getDepth()).thenReturn(4);
        when(currentPage.getParent(4)).thenReturn(parentPage);
        when(parentPage.listChildren(any())).thenReturn(iteratorMock);
        when(parentPage.getDepth()).thenReturn(6);
        assertEquals(0, underTest.getRegionListItems().size());
        assertEquals(0, underTest.getLanguageListItems().size());
    }
    @Test
    void testgetNavigationRoot(){
        assertEquals(null, underTest.getNavigationRoot());
    }
    @Test
    void testCountryRootPageTitle(){
        when(currentPage.getPageManager()).thenReturn(pageManager);
        when(currentPage.getDepth()).thenReturn(8);
        when(pageManager.getPage(navigationRoot)).thenReturn(navPage);
        when(navPage.getDepth()).thenReturn(4);
        when(currentPage.getParent(2)).thenReturn(parentPage);
        when(parentPage.getProperties()).thenReturn(valueMap);
        when(valueMap.containsKey("navTitle")).thenReturn(true);
        when(valueMap.get("navTitle", String.class)).thenReturn("navTitle");
        assertEquals("navTitle", underTest.getCountryRootPageTitle());
    }
    @Test
    void testgetOverRideCurrentPage(){
        assertEquals(null, underTest.getOverRideCurrentPage());
    }
}
package com.techdata.core.models;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.lang.reflect.Field;
import java.util.Iterator;
import java.util.List;

import com.adobe.cq.wcm.core.components.models.LanguageNavigation;
import com.adobe.cq.wcm.core.components.models.NavigationItem;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.designer.Style;

import org.apache.sling.api.SlingHttpServletRequest;
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
    private SlingHttpServletRequest request;

    @Mock
    LanguageNavigation delegateLanguageNavigation;

    @Mock
    private Page currentPage, navPage, parentPage;

    @Mock
    private Iterator<Page> iteratorMock;

    @Mock
    private Page nextPage;

    @Mock
    private PageManager pageManager;

    @Mock
    private ValueMap properties;

    @Mock
    private Style currentStyle;

    @Mock
    private List<NavigationItem> items;

    private String navigationRoot;

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
        when(currentPage.getPath()).thenReturn("/path/to/current/page");
        when(pageManager.getPage(navigationRoot)).thenReturn(navPage);
        when(navPage.getDepth()).thenReturn(4);
        when(currentPage.getParent(4)).thenReturn(parentPage);
        when(parentPage.listChildren(any())).thenReturn(iteratorMock);
        when(parentPage.getDepth()).thenReturn(6);
        when(iteratorMock.hasNext()).thenReturn(Boolean.TRUE, Boolean.FALSE);
        when(iteratorMock.next()).thenReturn(nextPage);
        when(nextPage.getName()).thenReturn("123");
        assertEquals(1, underTest.getRegionListItems().size());
        assertEquals(0, underTest.getLanguageListItems().size());
    }
}
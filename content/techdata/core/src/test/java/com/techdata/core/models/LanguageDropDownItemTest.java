package com.techdata.core.models;

import com.adobe.cq.wcm.core.components.models.ListItem;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageFilter;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Iterator;
import java.util.Locale;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class LanguageDropDownItemTest {

    private LanguageDropDownItem underTest;

    @Mock
    private Page page;

    @Mock
    private Iterator<Page> iteratorMock;

    @Mock
    private Page nextPage;


    @BeforeEach
    void setUp() {

    }

    @Test
    void LanguageDropDownItemTest() {

        when(page.listChildren(any())).thenReturn(iteratorMock);
        when(iteratorMock.hasNext()).thenReturn(Boolean.TRUE, Boolean.FALSE);
        when(iteratorMock.next()).thenReturn(nextPage);
        when(page.getPageTitle()).thenReturn("Page Title");
        when(page.getPath()).thenReturn("/path/to/page");
        when(page.getPath()).thenReturn("/path/to/page");
        underTest = new LanguageDropDownItem(page, Boolean.TRUE, 4);

        assertEquals(1, underTest.getChildren().size());
        assertEquals(page, underTest.getPage());
        assertEquals(Boolean.TRUE, underTest.getActive());
        assertEquals("Page Title", underTest.getTitle());
        assertEquals("/path/to/page.html", underTest.getURL());

    }
}
package com.techdata.core.models;

import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.wcm.core.components.models.ListItem;
import com.day.cq.commons.jcr.JcrConstants;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.testing.resourceresolver.MockResource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Iterator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class FilmStripListItemTest {

    private static final String PN_PHOTO = "photo";
    private static final String PN_BIO = "bio";
    private static final String PN_POSITION = "title";
    private static final String PN_NAME = "name";

    @Mock
    private Resource resource;

    @Mock
    ContentFragment cf;

    @Mock
    ContentElement ce;

    @Mock
    ListItem listItem;

    @Mock
    ValueMap vm;

    @Mock
    private Iterator<ContentElement> iteratorMock;

    @BeforeEach
    void setUp() {

        when(cf.getElements()).thenReturn(iteratorMock);
        when(iteratorMock.hasNext()).thenReturn(Boolean.TRUE, Boolean.FALSE);
        when(iteratorMock.next()).thenReturn(ce);
    }

    @Test
    void getFilmStripListItemName() {
        String returnValue = "the name in cf";
        when(ce.getName()).thenReturn(PN_NAME);
        when(ce.getContent()).thenReturn(returnValue);

        FilmStripListItem tdl = FilmStripListItem.getProfileListItem(cf, "");
        assertEquals(returnValue, tdl.getName());

    }

    @Test
    void getFilmStripListItemBio() {
        String returnValue = "the bio in cf";
        when(ce.getName()).thenReturn(PN_BIO);
        when(ce.getContent()).thenReturn(returnValue);

        FilmStripListItem tdl = FilmStripListItem.getProfileListItem(cf, "");
        assertEquals(returnValue, tdl.getBio());

    }

    @Test
    void getFilmStripListItemPhoto() {
        String returnValue = "/photo/path";
        when(ce.getName()).thenReturn(PN_PHOTO);
        when(ce.getContent()).thenReturn(returnValue);

        FilmStripListItem tdl = FilmStripListItem.getProfileListItem(cf, "");
        assertEquals(returnValue, tdl.getImagePath());

    }

    @Test
    void getFilmStripListItemPosition() {
        String returnValue = "the position in cf";
        when(ce.getName()).thenReturn(PN_POSITION);
        when(ce.getContent()).thenReturn(returnValue);

        FilmStripListItem tdl = FilmStripListItem.getProfileListItem(cf, "");
        assertEquals(returnValue, tdl.getPosition());

    }
}
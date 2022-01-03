package com.techdata.core.util;

import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.wcm.core.components.models.ListItem;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Iterator;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class ContentFragmentHelperTest {
    @InjectMocks
    ContentFragmentHelper contentFragmentHelper;

    @Mock
    private Resource resource;

    @Mock
    private ContentFragment contentFragment;

    @Mock
    private Iterator<ContentElement> iteratorMockCE;

    @Mock
    private ContentElement ce;

    @Test
    void isContentFragmentTest() {
        when(resource.adaptTo(ContentFragment.class)).thenReturn(contentFragment);
        ContentFragmentHelper.isContentFragment(resource);
    }

    @Test
    void convertCFElementsToMapTest() {
        when(contentFragment.getElements()).thenReturn(iteratorMockCE);
        when(iteratorMockCE.hasNext()).thenReturn(Boolean.TRUE, Boolean.FALSE);
        when(iteratorMockCE.next()).thenReturn(ce);
        when(ce.getName()).thenReturn("name");
        when(ce.getContent()).thenReturn("content");
        ContentFragmentHelper.convertCFElementsToMap(contentFragment);
    }
}
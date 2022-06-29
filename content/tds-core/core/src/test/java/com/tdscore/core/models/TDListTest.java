package com.tdscore.core.models;

import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.wcm.core.components.models.List;
import com.adobe.cq.wcm.core.components.models.ListItem;
import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.commons.lang.StringUtils;
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
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class TDListTest {

    private static final String PAGE_THUMBNAIL_NODENAME = "image";
    private static final String PAGE_THUMBNAIL_FILE_NODE_NAME = "image/file";
    private static final String FILE_REFERENCE_IMAGE_PATH = "/jcr:content/renditions/cq5dam.thumbnail.140.100.png";
    private static final String THUMBNAIL_FOLDER = "image/file/jcr:content/dam:thumbnails";


    private TDList underTest;

    @Mock
    private SlingHttpServletRequest request;

    @Mock
    private Resource resource, cfResource;

    @Mock
    private ContentFragment contentFragment;

    @Mock
    private ResourceResolver resolver;

    @Mock
    private PageManager pageManager;

    @Mock
    private List delegateList;

    @Mock
    private Collection<ListItem> cfListItems;

    @Mock
    private Iterator<ListItem> iteratorMock;

    @Mock
    private Iterator<ContentElement> iteratorMockCE;

    @Mock
    private ListItem cfListItem;

    @Mock
    private Page page;

    @Mock
    private ValueMap pageMap;

    @Mock
    private ContentElement ce;

    @Mock
    TDListItem tdListItem;

    @Mock
    Resource pageContentResource;

    @Mock
    Resource imageResource;

    @Mock
    private ExtractSVGModel extractSVGModel;

    @Mock
    ValueMap vm;

    @BeforeEach
    void setUp() {
        underTest = new TDList();
        Field requestField;
        try {
            requestField = underTest.getClass().getDeclaredField("request");
            requestField.setAccessible(true);
            requestField.set(underTest, request);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }

        Field delegateListField;
        try {
            delegateListField = underTest.getClass().getDeclaredField("delegateList");
            delegateListField.setAccessible(true);
            delegateListField.set(underTest, delegateList);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }

        when(request.getResource()).thenReturn(resource);
        when(resource.getResourceResolver()).thenReturn(resolver);
        when(resolver.adaptTo(PageManager.class)).thenReturn(pageManager);
        when(delegateList.getListItems()).thenReturn(cfListItems);
        when(cfListItems.size()).thenReturn(1);

        when(cfListItems.iterator()).thenReturn(iteratorMock);
        when(iteratorMock.hasNext()).thenReturn(Boolean.TRUE, Boolean.FALSE);
        when(iteratorMock.next()).thenReturn(cfListItem);
        when(cfListItem.getPath()).thenReturn("path/to/list/item");
        when(pageManager.getPage("path/to/list/item")).thenReturn(page);
        when(page.getProperties()).thenReturn(pageMap);
    }

    @Test
    void getTDListItemFromPageThumbnail() {

        String returnValue = "<svg></svg>";
        String returnTitleValue = "title";

        when(pageMap.containsKey("cfPath")).thenReturn(Boolean.FALSE);
        when(page.getContentResource()).thenReturn(pageContentResource);
        when(pageContentResource.getChild(PAGE_THUMBNAIL_NODENAME)).thenReturn(imageResource);
        when(pageContentResource.getChild(PAGE_THUMBNAIL_FILE_NODE_NAME)).thenReturn(null);
        when(pageContentResource.getValueMap()).thenReturn(vm);
        when(vm.containsKey(JcrConstants.JCR_TITLE)).thenReturn(true);
        when(vm.get(JcrConstants.JCR_TITLE, StringUtils.EMPTY)).thenReturn(returnTitleValue);
        Collection<ListItem> listOfVendorItems = underTest.getListItems();

        assertEquals(1, listOfVendorItems.size());

    }

    @Test
    void getVendorListItemVendorName() {

        when(pageMap.containsKey("cfPath")).thenReturn(Boolean.TRUE);
        when(pageMap.get("cfPath", StringUtils.EMPTY)).thenReturn("path/to/content/fragment");
        when(resolver.getResource("path/to/content/fragment")).thenReturn(cfResource);
        when(cfResource.adaptTo(ContentFragment.class)).thenReturn(contentFragment);
        when(contentFragment.getElements()).thenReturn(iteratorMockCE);
        when(iteratorMockCE.hasNext()).thenReturn(Boolean.TRUE, Boolean.FALSE);
        when(iteratorMockCE.next()).thenReturn(ce);
        when(ce.getName()).thenReturn("vendor-name");
        when(ce.getContent()).thenReturn("ce-content");

        assertEquals(1, underTest.getListItems().size());
    }

}
package com.techdata.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class LinkListTest {

    private final AemContext context = new AemContext();

    private LinkList links;

    @BeforeEach
    void setUp() {
        context.addModelsForClasses(LinkList.class);
        context.load().json("/com.techdata.core.models/linklist.json", "/linklist");
    }

    @Test
    void initModel() {
        context.currentResource("/linklist");
        links = context.request().adaptTo(LinkList.class);
        assertEquals("item0", links.getLinks().getChild("item0").getName());
    }

    @Test
    void getLinks() {
        context.currentResource("/linklist");
        links = context.request().adaptTo(LinkList.class);
        assertEquals("©2021 Tech Data Corp.", links.getLinks().getChild("item0").getValueMap().get("platformName"));
    }

    @Test
    void getLinkList() {
        context.currentResource("/linklist");
        links = context.request().adaptTo(LinkList.class);
        assertEquals(6, links.getLinkList().size());
    }
}
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

    private LinkList linkList;

    @BeforeEach
    void setUp() {
        context.addModelsForClasses(LinkList.class);
        context.load().json("/com.techdata.core.models/linklist.json", "/linklist");
        context.currentResource("/linklist");
        linkList = context.request().adaptTo(LinkList.class);
    }

    @Test
    void getSize() {
        assertEquals(6, linkList.getLinks().size());
    }

    @Test
    void getLinkName() {
        assertEquals("©2021 Tech Data Corp.", linkList.getLinks().get(0).getPlatformName());
    }

    @Test
    void getLinkUrl() {
        assertEquals("https://www.techdata.com/privacy/", linkList.getLinks().get(1).getLinkUrl());
    }
}
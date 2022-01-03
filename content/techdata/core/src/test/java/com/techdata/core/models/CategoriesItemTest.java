package com.techdata.core.models;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class CategoriesItemTest {
    CategoriesItem categoriesItem;
    @BeforeEach
    void setUp() {
        categoriesItem = new CategoriesItem();
    }

    @Test
    void testgetLinkLabel() {
        categoriesItem.setLinkLabel("link");
        assertEquals("link",categoriesItem.getLinkLabel());
    }

    @Test
    void testgetLinkUrl() {
        categoriesItem.setLinkUrl("link");
        assertEquals("link",categoriesItem.getLinkUrl());
    }

    @Test
    void testgetLinkTarget() {
        categoriesItem.setLinkTarget("link");
        assertEquals("link",categoriesItem.getLinkTarget());
    }
}
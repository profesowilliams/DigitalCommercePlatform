package com.tdscore.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class SocialLinksTest {

    private final AemContext context = new AemContext();

    private SocialLinks links;

    @BeforeEach
    void setUp() {
        context.addModelsForClasses(SocialLinks.class);
        context.load().json("/com.tdscore.core.models/links.json", "/component");
    }

    @Test
    void getSocialLinks() {
        context.currentResource("/component");
        links = context.request().adaptTo(SocialLinks.class);
        assertEquals("item0", links.getSocialLinks().getChild("item0").getName());
    }

    @Test
    void getSocialLinkList() {
        context.currentResource("/component");
        links = context.request().adaptTo(SocialLinks.class);
        assertEquals(3, links.getSocialLinkList().size());
    }

}
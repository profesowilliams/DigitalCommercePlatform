package com.tdscore.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class CarouselComponentModelTest {

    private final AemContext context = new AemContext();

    private CarouselComponentModel items;

    @BeforeEach
    void setUp() {
        context.addModelsForClasses(CarouselComponentModel.class);
        context.load().json("/com.tdscore.core.models/actionItems.json", "/action");
    }

    @Test
    void getActionItems() {
        Resource resource = context.currentResource("/action");
        items = resource.adaptTo(CarouselComponentModel.class);
        assertEquals("/content/tds-core/language-masters/en/about-us", items.getActionItems().getChild("item0").getValueMap().get("linkUrl"));
    }
}
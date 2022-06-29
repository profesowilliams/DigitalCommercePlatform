package com.tdscore.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class MegaMenuTest {
    private final AemContext context = new AemContext();

    private MegaMenu underTest;

    @BeforeEach
    void setUp() {
        context.addModelsForClasses(MegaMenu.class);
        context.load().json("/com.tdscore.core.models/megamenu.json", "/megamenu");
    }

    @Test
    void initModel() {
        context.currentResource("/megamenu");
        underTest = context.request().adaptTo(MegaMenu.class);
        assertEquals("hello from model4", underTest.getMessage());
        assertEquals(4, underTest.getFirstLevelMenuItems().size());
    }
}

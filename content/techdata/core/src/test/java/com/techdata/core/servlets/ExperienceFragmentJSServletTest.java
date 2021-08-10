package com.techdata.core.servlets;

import com.techdata.core.slingcaconfig.ExperienceFragmentJSServletConfig;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ExperienceFragmentJSServletTest {

    private ExperienceFragmentJSServlet underTest;

    @Mock
    private ExperienceFragmentJSServletConfig configData;

    @BeforeEach
    void setUp() {
        underTest = new ExperienceFragmentJSServlet();
        Field configDataField = null;
        try {
            configDataField = underTest.getClass().getDeclaredField("configData");
            configDataField.setAccessible(true);
            configDataField.set(underTest, configData);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }
    }

    @Test
    void buildShopJSONTest() {
        when(configData.shopUrl()).thenReturn("https://shop.cstenet.com");
        assertNotNull(underTest.buildShopJSON());
    }
}
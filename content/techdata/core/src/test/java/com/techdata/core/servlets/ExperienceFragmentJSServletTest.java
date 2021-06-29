package com.techdata.core.servlets;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ExperienceFragmentJSServletTest {

    private ExperienceFragmentJSServlet underTest;

    @BeforeEach
    void setUp() {
        underTest = new ExperienceFragmentJSServlet();
    }

    @Test
    void buildShopJSONTest() {
        assertNotNull(underTest.buildShopJSON());
    }
}
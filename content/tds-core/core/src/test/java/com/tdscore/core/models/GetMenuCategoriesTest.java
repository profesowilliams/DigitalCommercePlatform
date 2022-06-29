package com.tdscore.core.models;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class GetMenuCategoriesTest {
    @InjectMocks
    GetMenuCategories getMenuCategories;
    @BeforeEach
    void setUp() {
        getMenuCategories = new GetMenuCategories();
    }
    @Test
    void testcategoriesList(){
        getMenuCategories.getCategoriesList();
    }
}

package com.tdscore.core.models;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class MenuCategoriesListTest {

    MenuCategoriesList menuCategoriesList;

    @BeforeEach
    void setUp() {
        menuCategoriesList = new MenuCategoriesList();
    }
    @Test
    void testcategoryName(){
        menuCategoriesList.setCategoryName("name");
        assertEquals("name",menuCategoriesList.getCategoryName());
    }
    @Test
    void testmenuList(){
        List<CategoriesItem> list = new ArrayList<>();
        menuCategoriesList.setMenuList(list);
        assertEquals(list,menuCategoriesList.getMenuList());
    }
}

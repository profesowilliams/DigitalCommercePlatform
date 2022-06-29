package com.tdscore.core.models;

import com.adobe.cq.wcm.core.components.models.Page;
import com.tdscore.core.models.PageImpl;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.xss.XSSAPI;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;

import static com.tdscore.core.util.Constants.COUNTRY_PAGE;
import static com.tdscore.core.util.Constants.LOCALE_PAGE;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class PageImplTest {

    private PageImpl tdPage;

    @Mock
    private Page basePage;

    @Mock
    private XSSAPI xssapi;

    @Mock
    private SlingHttpServletRequest request;

    @Mock
    private ValueMap pageProperties, localePageProperties, countryPageProperties;

    @Mock
    private com.day.cq.wcm.api.Page currentPage, localePage, countryPage, parentPage;

    @BeforeEach
    void setUp() {
        tdPage = new PageImpl(xssapi);
        Field basePageField;
        Field servletField;
        Field pagePropertiesField;
        Field currentPageField;
        try {
            basePageField = tdPage.getClass().getDeclaredField("basePage");
            basePageField.setAccessible(true);
            basePageField.set(tdPage, basePage);

            servletField = tdPage.getClass().getDeclaredField("request");
            servletField.setAccessible(true);
            servletField.set(tdPage, request);

            pagePropertiesField = tdPage.getClass().getDeclaredField("pageProperties");
            pagePropertiesField.setAccessible(true);
            pagePropertiesField.set(tdPage, pageProperties);

            currentPageField = tdPage.getClass().getDeclaredField("currentPage");
            currentPageField.setAccessible(true);
            currentPageField.set(tdPage, currentPage);
        } catch(Exception e){}
    }

    @Test
    void validateBasePageAttributes() {
        when(basePage.getLanguage()).thenReturn("en");
        when(basePage.getCssClassNames()).thenReturn("cssNames");
        when(basePage.getId()).thenReturn("1234ABCD");
        when(basePage.getData()).thenReturn(null);
        when(basePage.getRedirectTarget()).thenReturn(null);
        when(request.getServerName()).thenReturn("https://tdscore.com");
        when(pageProperties.get("pageType", StringUtils.EMPTY)).thenReturn("home");
        when(basePage.getTitle()).thenReturn("Home");
        when(basePage.getBrandSlug()).thenReturn("Brand Slug");
        when(basePage.getKeywords()).thenReturn(null);
        when(basePage.getTemplateName()).thenReturn("Home Template");
        when(basePage.getDesignPath()).thenReturn("/path/to/design");
        when(basePage.getStaticDesignPath()).thenReturn("/path/to/static/design");
        when(basePage.getClientLibCategories()).thenReturn(null);
        when(basePage.getClientLibCategoriesJsHead()).thenReturn(null);
        when(basePage.getClientLibCategoriesJsBody()).thenReturn(null);
        when(basePage.hasCloudconfigSupport()).thenReturn(Boolean.FALSE);
        when(basePage.getAppResourcesPath()).thenReturn("/app/resources/path");
        when(basePage.getHtmlPageItems()).thenReturn(null);

        assertEquals(tdPage.getLanguage(), "en");
        assertEquals(tdPage.getCssClassNames(), "cssNames");
        assertEquals(tdPage.getId(), "1234ABCD");
        assertNull(tdPage.getData());
        assertNull(tdPage.getRedirectTarget());
        assertEquals(tdPage.getPageHost(), "https://tdscore.com");
        assertEquals(tdPage.getPageType(), "home");
        assertEquals(tdPage.getTitle(), "Home");
        assertEquals(tdPage.getBrandSlug(), "Brand Slug");
        assertNull(tdPage.getKeywords());
        assertEquals(tdPage.getTemplateName(), "Home Template");
        assertEquals(tdPage.getDesignPath(), "/path/to/design");
        assertEquals(tdPage.getStaticDesignPath(), "/path/to/static/design");
        assertNull(tdPage.getClientLibCategories());
        assertNull(tdPage.getClientLibCategoriesJsHead());
        assertNull(tdPage.getClientLibCategoriesJsBody());
        assertFalse(tdPage.hasCloudconfigSupport());
        assertEquals(tdPage.getAppResourcesPath(), "/app/resources/path");
        assertNull(tdPage.getHtmlPageItems());
    }

    @Test
    void validateTDAnalyticsPageName() {
        when(currentPage.getAbsoluteParent(LOCALE_PAGE)).thenReturn(localePage);
        when(currentPage.getPath()).thenReturn(CURR_PAGE_PATH);
        when(localePage.getPath()).thenReturn(LOCALE_PAGE_PATH);
        when(localePage.getParent()).thenReturn(countryPage);
        when(countryPage.getName()).thenReturn("ca");
        when(localePage.getName()).thenReturn("fr");
        assertEquals(tdPage.getAnalyticsPageName(), "ca:fr:products");
        when(currentPage.getPath()).thenReturn(LOCALE_PAGE_PATH);
        when(pageProperties.get("pageType", StringUtils.EMPTY)).thenReturn("home");
        assertEquals(tdPage.getAnalyticsPageName(), "ca:fr:home");
    }

    @Test
    void validateTDCountryAndCurrency() {
        when(currentPage.getAbsoluteParent(COUNTRY_PAGE)).thenReturn(null);
        assertEquals(tdPage.getCountry(), "us");
        when(currentPage.getAbsoluteParent(COUNTRY_PAGE)).thenReturn(countryPage);
        when(countryPage.getName()).thenReturn("ca");
        assertEquals(tdPage.getCountry(), "ca");

        when(countryPage.getProperties()).thenReturn(countryPageProperties);
        when(countryPageProperties.get("currency", "USD")).thenReturn("CAD");
        assertEquals(tdPage.getCurrencyCode(), "CAD");
    }

    @Test
    void validateTDSiteSections() {
        when(currentPage.getAbsoluteParent(LOCALE_PAGE)).thenReturn(localePage);
//        when(currentPage.getParent()).thenReturn(parentPage);
        when(currentPage.getPath()).thenReturn(CURR_PAGE_PATH);
        when(localePage.getPath()).thenReturn(LOCALE_PAGE_PATH);
        assertNotNull(tdPage.getSiteSections());
    }

    @Test
    void validateTDErrorStatuses() {
        when(currentPage.getAbsoluteParent(LOCALE_PAGE)).thenReturn(localePage);
        when(localePage.getProperties()).thenReturn(localePageProperties);
        when(currentPage.getPath()).thenReturn(ERROR_404_PAGE_PATH);
        when(localePageProperties.get("errorPages", String.class)).thenReturn(ERROR_PAGE_PATH);
        assertEquals(tdPage.getError404(), "true");
        when(pageProperties.get("errorCode","404")).thenReturn("404");
        when(localePageProperties.get("errorCode", String.class)).thenReturn("404");
        assertEquals(tdPage.getErrorCode(), "404");
        assertEquals(tdPage.getErrorName(), null);

        when(currentPage.getPath()).thenReturn(CURR_PAGE_PATH);
        assertEquals(tdPage.getError404(), "false");
        assertEquals(tdPage.getErrorCode(), null);
        assertEquals(tdPage.getErrorName(), null);
    }

    private static final String COUNTRY_PAGE_PATH = "/content/tdscore/americas/ca";
    private static final String LOCALE_PAGE_PATH = COUNTRY_PAGE_PATH + "/fr";
    private static final String CURR_PAGE_PATH = LOCALE_PAGE_PATH + "/products";
    private static final String ERROR_PAGE_PATH = LOCALE_PAGE_PATH + "/errors";
    private static final String ERROR_404_PAGE_PATH = LOCALE_PAGE_PATH + "/errors/404";
}
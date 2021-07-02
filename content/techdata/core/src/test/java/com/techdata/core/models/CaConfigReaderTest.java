package com.techdata.core.models;

import com.day.cq.wcm.api.Page;
import com.techdata.core.slingcaconfig.SearchBarConfiguration;
import com.techdata.core.slingcaconfig.AnalyticsConfiguration;
import com.techdata.core.slingcaconfig.MiniCartConfiguration;
import com.techdata.core.slingcaconfig.ServiceEndPointsConfiguration;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.caconfig.ConfigurationBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class CaConfigReaderTest {

    private CaConfigReader underTest;

    @Mock
    private Page page;

    @Mock
    private ConfigurationBuilder configurationBuilder;

    @Mock
    private ServiceEndPointsConfiguration serviceEndPointsConfiguration;

    @Mock
    private AnalyticsConfiguration analyticsConfiguration;

    @Mock
    private MiniCartConfiguration mcConfiguration;

    @Mock
    private SearchBarConfiguration searchBarConfiguration;

    @BeforeEach
    void setUp() {
        underTest = new CaConfigReader();

        Field pageField = null;
        try {
            pageField = underTest.getClass().getDeclaredField("page");
            pageField.setAccessible(true);
            pageField.set(underTest, page);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }
    }

    @Test
    void getVendorListItemVendorName() {
        when(page.adaptTo(ConfigurationBuilder.class)).thenReturn(configurationBuilder);
        when(configurationBuilder.as(ServiceEndPointsConfiguration.class)).thenReturn(serviceEndPointsConfiguration);
        when(configurationBuilder.as(AnalyticsConfiguration.class)).thenReturn(analyticsConfiguration);
        when(configurationBuilder.as(MiniCartConfiguration.class)).thenReturn(mcConfiguration);
        when(configurationBuilder.as(SearchBarConfiguration.class)).thenReturn(searchBarConfiguration);


        when(serviceEndPointsConfiguration.uiServiceDomain()).thenReturn("uiServiceDomain");
        when(serviceEndPointsConfiguration.catalogEndpoint()).thenReturn("catalogEndpoint");
        when(serviceEndPointsConfiguration.authorizationPageURL()).thenReturn("authorizationPageURL");
        when(serviceEndPointsConfiguration.loginEndpoint()).thenReturn("loginEndpoint");
        when(serviceEndPointsConfiguration.pingAppId()).thenReturn("pingAppId");
        when(serviceEndPointsConfiguration.activeCartEndpoint()).thenReturn("activeCartEndpoint");
        when(serviceEndPointsConfiguration.myConfigurationsEndpoint()).thenReturn("myConfigurationsEndpoint");
        when(serviceEndPointsConfiguration.myOrdersEndpoint()).thenReturn("myOrdersEndpoint");
        when(serviceEndPointsConfiguration.myQuotesEndpoint()).thenReturn("myQuotesEndpoint");
        when(serviceEndPointsConfiguration.myDealsEndpoint()).thenReturn("myDealsEndpoint");
        when(serviceEndPointsConfiguration.myRenewalsEndpoint()).thenReturn("myRenewalsEndpoint");
        when(serviceEndPointsConfiguration.cartDetailsEndpoint()).thenReturn("cartDetailsEndpoint");
        when(serviceEndPointsConfiguration.savedCartsEndpoint()).thenReturn("savedCartsEndpoint");
        when(serviceEndPointsConfiguration.quoteGridEndpoint()).thenReturn("quoteGridEndpoint");
        when(serviceEndPointsConfiguration.vendorConnectionEndpoint()).thenReturn("vendorConnectionEndpoint");
        when(serviceEndPointsConfiguration.orderGridEndpoint()).thenReturn("orderGridEndpoint");
        when(mcConfiguration.shopDomain()).thenReturn("shopDomain");
        when(mcConfiguration.cartURL()).thenReturn("cartURL");
        when(mcConfiguration.tdPartSmart()).thenReturn("tdPartSmart");
        when(analyticsConfiguration.analyticsSnippet()).thenReturn("analyticsSnippet");
        when(searchBarConfiguration.allSearchEndpoint()).thenReturn("allSearchEndpoint");
        when(searchBarConfiguration.productSearchEndpoint()).thenReturn("productSearchEndpoint");
        when(searchBarConfiguration.contentSearchEndpoint()).thenReturn("contentSearchEndpoint");
        when(searchBarConfiguration.quoteSearchEndpoint()).thenReturn("quoteSearchEndpoint");
        when(searchBarConfiguration.orderSearchEndpoint()).thenReturn("orderSearchEndpoint");
        when(searchBarConfiguration.spaSearchEndpoint()).thenReturn("spaSearchEndpoint");


        underTest.init();
        assertEquals("uiServiceDomain", underTest.getUiServiceDomain());
        assertEquals("catalogEndpoint", underTest.getCatalogEndpoint());
        assertEquals("authorizationPageURL", underTest.getAuthorizationPageURL());
        assertEquals("loginEndpoint", underTest.getLoginEndpoint());
        assertEquals("pingAppId", underTest.getPingAppId());
        assertEquals("activeCartEndpoint", underTest.getActiveCartEndpoint());
        assertEquals("myConfigurationsEndpoint", underTest.getMyConfigurationsEndpoint());
        assertEquals("myOrdersEndpoint", underTest.getMyOrdersEndpoint());
        assertEquals("myQuotesEndpoint", underTest.getMyQuotesEndpoint());
        assertEquals("myDealsEndpoint", underTest.getMyDealsEndpoint());
        assertEquals("myRenewalsEndpoint", underTest.getMyRenewalsEndpoint());
        assertEquals("cartDetailsEndpoint", underTest.getCartDetailsEndpoint());
        assertEquals("savedCartsEndpoint", underTest.getSavedCartsEndpoint());
        assertEquals("quoteGridEndpoint", underTest.getQuoteGridEndpoint());
        assertEquals("vendorConnectionEndpoint", underTest.getVendorConnectionEndpoint());
        assertEquals("orderGridEndpoint", underTest.getOrderGridEndpoint());
        assertEquals("shopDomain", underTest.getShopDomain());
        assertEquals("cartURL", underTest.getCartURL());
        assertEquals("tdPartSmart", underTest.getTdPartSmart());
        assertEquals("analyticsSnippet", underTest.getAnalyticsSnippet());
        assertEquals("allSearchEndpoint", underTest.getAllSearchEndpoint());
        assertEquals("productSearchEndpoint", underTest.getProductSearchEndpoint());
        assertEquals("contentSearchEndpoint", underTest.getContentSearchEndpoint());
        assertEquals("quoteSearchEndpoint", underTest.getQuoteSearchEndpoint());
        assertEquals("orderSearchEndpoint", underTest.getOrderSearchEndpoint());
        assertEquals("spaSearchEndpoint", underTest.getSpaSearchEndpoint());




    }
}
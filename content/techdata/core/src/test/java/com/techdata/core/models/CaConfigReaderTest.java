package com.techdata.core.models;

import com.day.cq.wcm.api.Page;
import com.techdata.core.slingcaconfig.SearchBarConfiguration;
import com.techdata.core.slingcaconfig.RedirectConfiguration;
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

    @Mock
    private RedirectConfiguration redirectConfiguration;

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
        when(configurationBuilder.as(RedirectConfiguration.class)).thenReturn(redirectConfiguration);


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
        when(serviceEndPointsConfiguration.quotesPreviewEndPoint()).thenReturn("quotesPreviewEndPoint");
        when(serviceEndPointsConfiguration.quotesPreviewPricingEndPoint()).thenReturn("quotesPreviewPricingEndPoint");
        when(serviceEndPointsConfiguration.configurationsEndpoint()).thenReturn("configurationsEndpoint");
        when(mcConfiguration.shopDomain()).thenReturn("shopDomain");
        when(mcConfiguration.cartURL()).thenReturn("cartURL");
        when(mcConfiguration.tdPartSmart()).thenReturn("tdPartSmart");
        when(analyticsConfiguration.analyticsSnippet()).thenReturn("analyticsSnippet");

        when(searchBarConfiguration.allSearchEndpoint()).thenReturn("allSearchEndpoint");
        when(searchBarConfiguration.allSuggestionUrl()).thenReturn("allSuggestionUrl");
        when(searchBarConfiguration.productSearchEndpoint()).thenReturn("productSearchEndpoint");
        when(searchBarConfiguration.productSuggestionUrl()).thenReturn("productSuggestionUrl");
        when(searchBarConfiguration.contentSearchEndpoint()).thenReturn("contentSearchEndpoint");
        when(searchBarConfiguration.contentSuggestionUrl()).thenReturn("contentSuggestionUrl");
        when(searchBarConfiguration.orderSearchEndpoint()).thenReturn("orderSearchEndpoint");
        when(searchBarConfiguration.spaSearchEndpoint()).thenReturn("spaSearchEndpoint");
        when(searchBarConfiguration.typeAheadDomain()).thenReturn("typeAheadDomain");
        when(searchBarConfiguration.typeAheadSearchTermSuffix()).thenReturn("typeAheadSearchTermSuffix");
        when(searchBarConfiguration.typeAheadXDomainScript()).thenReturn("typeAheadXDomainScript");
        when(searchBarConfiguration.typeAheadProxyScript()).thenReturn("typeAheadProxyScript");
        when(searchBarConfiguration.searchDomain()).thenReturn("searchDomain");

        when(searchBarConfiguration.legacySearchEndpoint()).thenReturn("legacySearchEndpoint");
        when(searchBarConfiguration.searchKeywordParameter()).thenReturn("searchKeywordParameter");
        when(searchBarConfiguration.searchRefinementsParameter()).thenReturn("searchRefinementsParameter");
        when(searchBarConfiguration.searchBParameter()).thenReturn("searchBParameter");
        when(searchBarConfiguration.contentSearchTab()).thenReturn("contentSearchTab");
        when(redirectConfiguration.dcpDashboardPage()).thenReturn("dcpDashboardPage");
        when(redirectConfiguration.quoteListingPage()).thenReturn("quoteListingPage");
        when(redirectConfiguration.quoteDetailPage()).thenReturn("quoteDetailPage");
        when(redirectConfiguration.quotePreviewPage()).thenReturn("quotePreviewPage");
        when(redirectConfiguration.orderListingPage()).thenReturn("orderListingPage");
        when(redirectConfiguration.orderDetailPage()).thenReturn("orderDetailPage");





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
        assertEquals("quotesPreviewEndPoint", underTest.getQuotesPreviewEndPoint());
        assertEquals("quotesPreviewPricingEndPoint", underTest.getQuotesPreviewPricingEndPoint());
        assertEquals("configurationsEndpoint", underTest.getConfigurationsEndpoint());
        assertEquals("shopDomain", underTest.getShopDomain());
        assertEquals("cartURL", underTest.getCartURL());
        assertEquals("tdPartSmart", underTest.getTdPartSmart());
        assertEquals("analyticsSnippet", underTest.getAnalyticsSnippet());
        assertEquals("allSearchEndpoint", underTest.getAllSearchEndpoint());
        assertEquals("allSuggestionUrl", underTest.getAllSuggestionUrl());
        assertEquals("productSearchEndpoint", underTest.getProductSearchEndpoint());
        assertEquals("productSuggestionUrl", underTest.getProductSuggestionUrl());
        assertEquals("contentSearchEndpoint", underTest.getContentSearchEndpoint());
        assertEquals("contentSuggestionUrl", underTest.getContentSuggestionUrl());
        assertEquals("orderSearchEndpoint", underTest.getOrderSearchEndpoint());
        assertEquals("spaSearchEndpoint", underTest.getSpaSearchEndpoint());
        assertEquals("typeAheadDomain", underTest.getTypeAheadDomain());
        assertEquals("typeAheadSearchTermSuffix", underTest.getTypeAheadSearchTermSuffix());
        assertEquals("typeAheadXDomainScript", underTest.getTypeAheadXDomainScript());
        assertEquals("typeAheadProxyScript", underTest.getTypeAheadProxyScript());
        assertEquals("searchDomain", underTest.getSearchDomain());
        assertEquals("legacySearchEndpoint", underTest.getLegacySearchEndpoint());
        assertEquals("searchKeywordParameter", underTest.getSearchKeywordParameter());
        assertEquals("searchRefinementsParameter", underTest.getSearchRefinementsParameter());
        assertEquals("searchBParameter", underTest.getSearchBParameter());
        assertEquals("contentSearchTab", underTest.getContentSearchTab());
        assertEquals("dcpDashboardPage", underTest.getDcpDashboardPage());
        assertEquals("quoteListingPage", underTest.getQuoteListingPage());
        assertEquals("quoteDetailPage", underTest.getQuoteDetailPage());
        assertEquals("quotePreviewPage", underTest.getQuotePreviewPage());
        assertEquals("orderListingPage", underTest.getOrderListingPage());
        assertEquals("orderDetailPage", underTest.getOrderDetailPage());
    }
}

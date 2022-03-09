/**
 *
 */
package com.techdata.core.models;

import com.day.cq.wcm.api.Page;
import com.techdata.core.slingcaconfig.*;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.caconfig.ConfigurationBuilder;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;

import javax.annotation.PostConstruct;
import java.util.Arrays;

@Model(adaptables= {SlingHttpServletRequest.class,Resource.class})
public class CaConfigReader {

    @ScriptVariable(name = "currentPage")
    private Page page;

    private String uiServiceDomain;

    private String catalogEndpoint;

    private String authorizationPageURL;

    private String loginEndpoint;

    private String pingAppId;

    private String activeCartEndpoint;

    private String myConfigurationsEndpoint;

    private String myOrdersEndpoint;

    private String orderDetailEndpoint;

    private String downloadAllInvoicesEndpoint;

    private String downloadInvoiceEndpoint;

    private String dealsForEndpoint;

    private String myQuotesEndpoint;

    private String myDealsEndpoint;

    private String myOrderStatusEndpoint;

    private String myRenewalsEndpoint;

    private String topItemsEndpoint;

    private String createQuoteEndpoint;

    private String replaceCartEndpoint;

    private String cartDetailsEndpoint;

    private String pricingConditionsEndPoint;

    private String orderLevelsForQuotePreviewEndpoint;

    private String estimatedIdListEndpoint;

    private String estimatedIdDetailsEndpoint;

    private String savedCartsEndpoint;

    private String quoteGridEndpoint;

    private String quoteDetailEndpoint;

    private String orderGridEndpoint;

    private String quotesPreviewEndPoint;

    private String quickQuoteEndpoint;

    private String quotesPreviewPricingEndPoint;

    private String accountAdressEndPoint;

    private String vendorConnectionEndpoint;

    private String setVendorConnectionEndpoint;

    private String vendorDisconnectEndpoint;

    private String configurationsEndpoint;

    private  String shopDomain;

    private String cartURL;

    private String expressCheckoutRedirectUrl;

    private String tdPartSmart;

    private String analyticsSnippet;

    private String allSearchEndpoint;

    private String allSuggestionUrl;

    private String productSearchEndpoint;

    private String productSuggestionUrl;

    private String contentSearchEndpoint;

    private String contentSuggestionUrl;

    private String quoteSearchEndpoint;

    private String orderSearchEndpoint;

    private String quoteDcpLookupEndpoint;
    
    private String quoteValidateResponseEndPoint;

    private String quotePartialEndPoint;

    private String orderValidateResponseEndPoint;

    private String orderPartialEndPoint;

    private String orderDcpLookupEndpoint;

    private String spaSearchEndpoint;

    private String typeAheadDomain;

    private String typeAheadSearchTermSuffix;

    private String typeAheadXDomainScript;

    private String typeAheadProxyScript;

    private String searchDomain;

    private String legacySearchEndpoint;

    private String searchKeywordParameter;

    private String searchRefinementsParameter;

    private String searchBParameter;

    private String contentSearchTab;

    private String dcpDashboardPage;

    private String quoteListingPage;

    private String quoteDetailPage;

    private String quotePreviewPage;

    private String orderListingPage;

    private String orderDetailPage;

    private String puchOutEndpoint;

    private String actionItemsEndpoint;

    private String shopDomainPage;

    private String quoteDetailsXLSEndpoint;

    private String productEmptyImageUrl;

    private boolean enableQualtricsCode;

    private String downloadOrderDetailsEndpoint;

    private String dcpDomain;

    private String allowedFileExtensions;

    private String fileThresholdInMB;

    private String renewalsGridEndpoint;

    private String agGridLicenseKey;

    private String renewalDetailLineItemEndpoint;

    private String renewalDetailsEndpoint;

    private String exportXLSRenewalsEndpoint;

    @PostConstruct
    public void init() {
        ServiceEndPointsConfiguration serviceEndPointsConfiguration =
                page.adaptTo(ConfigurationBuilder.class).as(ServiceEndPointsConfiguration.class);
        MiniCartConfiguration mcConfiguration =  page.adaptTo(ConfigurationBuilder.class).as(MiniCartConfiguration.class);
        AnalyticsConfiguration analyticsConfiguration =  page.adaptTo(ConfigurationBuilder.class).as(AnalyticsConfiguration.class);
        SearchBarConfiguration searchBarConfiguration = page.adaptTo(ConfigurationBuilder.class).as(SearchBarConfiguration.class);
        RedirectConfiguration redirectConfiguration = page.adaptTo(ConfigurationBuilder.class).as(RedirectConfiguration.class);

        uiServiceDomain =  serviceEndPointsConfiguration.uiServiceDomain();
        catalogEndpoint = serviceEndPointsConfiguration.catalogEndpoint();
        authorizationPageURL = serviceEndPointsConfiguration.authorizationPageURL();
        loginEndpoint = serviceEndPointsConfiguration.loginEndpoint();
        pingAppId =  serviceEndPointsConfiguration.pingAppId();
        activeCartEndpoint = serviceEndPointsConfiguration.activeCartEndpoint();
        myConfigurationsEndpoint = serviceEndPointsConfiguration.myConfigurationsEndpoint();
        myOrdersEndpoint = serviceEndPointsConfiguration.myOrdersEndpoint();
        myQuotesEndpoint = serviceEndPointsConfiguration.myQuotesEndpoint();
        myDealsEndpoint = serviceEndPointsConfiguration.myDealsEndpoint();
        myOrderStatusEndpoint = serviceEndPointsConfiguration.myOrderStatusEndpoint();
        myRenewalsEndpoint = serviceEndPointsConfiguration.myRenewalsEndpoint();
        topItemsEndpoint = serviceEndPointsConfiguration.topItemsEndpoint();
        createQuoteEndpoint = serviceEndPointsConfiguration.createQuoteEndpoint();
        replaceCartEndpoint = serviceEndPointsConfiguration.replaceCartEndpoint();
        cartDetailsEndpoint = serviceEndPointsConfiguration.cartDetailsEndpoint();
        pricingConditionsEndPoint = serviceEndPointsConfiguration.pricingConditionsEndPoint();
        orderLevelsForQuotePreviewEndpoint = serviceEndPointsConfiguration.orderLevelsForQuotePreviewEndpoint();
        estimatedIdListEndpoint = serviceEndPointsConfiguration.estimatedIdListEndpoint();
        estimatedIdDetailsEndpoint = serviceEndPointsConfiguration.estimatedIdDetailsEndpoint();
        savedCartsEndpoint = serviceEndPointsConfiguration.savedCartsEndpoint();
        quoteGridEndpoint = serviceEndPointsConfiguration.quoteGridEndpoint();
        quoteDetailEndpoint = serviceEndPointsConfiguration.quoteDetailEndpoint();
        orderDetailEndpoint = serviceEndPointsConfiguration.orderDetailEndpoint();
        downloadAllInvoicesEndpoint = serviceEndPointsConfiguration.downloadAllInvoicesEndpoint();
        downloadInvoiceEndpoint = serviceEndPointsConfiguration.downloadInvoiceEndpoint();
        dealsForEndpoint = serviceEndPointsConfiguration.dealsForEndpoint();
        vendorConnectionEndpoint = serviceEndPointsConfiguration.vendorConnectionEndpoint();
        setVendorConnectionEndpoint = serviceEndPointsConfiguration.setVendorConnectionEndpoint();
        vendorDisconnectEndpoint = serviceEndPointsConfiguration.vendorDisconnectEndpoint();
        orderGridEndpoint = serviceEndPointsConfiguration.orderGridEndpoint();
        quotesPreviewEndPoint = serviceEndPointsConfiguration.quotesPreviewEndPoint();
        quickQuoteEndpoint = serviceEndPointsConfiguration.quickQuoteEndpoint();
        quotesPreviewPricingEndPoint = serviceEndPointsConfiguration.quotesPreviewPricingEndPoint();
        accountAdressEndPoint = serviceEndPointsConfiguration.accountAdressEndPoint();
        configurationsEndpoint = serviceEndPointsConfiguration.configurationsEndpoint();
        puchOutEndpoint = serviceEndPointsConfiguration.puchOutEndpoint();
        downloadOrderDetailsEndpoint = serviceEndPointsConfiguration.downloadOrderDetailsEndpoint();
        shopDomain = mcConfiguration.shopDomain();
        renewalsGridEndpoint = serviceEndPointsConfiguration.renewalsGridEndpoint();
        renewalDetailLineItemEndpoint = serviceEndPointsConfiguration.renewalDetailLineItemEndpoint();
        renewalDetailsEndpoint = serviceEndPointsConfiguration.renewalDetailsEndpoint();
        exportXLSRenewalsEndpoint = serviceEndPointsConfiguration.exportXLSRenewalsEndpoint();
        cartURL = mcConfiguration.cartURL();
        expressCheckoutRedirectUrl = mcConfiguration.expressCheckoutRedirectUrl();
        tdPartSmart = mcConfiguration.tdPartSmart();
        analyticsSnippet = analyticsConfiguration.analyticsSnippet();
        allSearchEndpoint = searchBarConfiguration.allSearchEndpoint();
        allSuggestionUrl = searchBarConfiguration.allSuggestionUrl();
        productSearchEndpoint = searchBarConfiguration.productSearchEndpoint();
        productSuggestionUrl = searchBarConfiguration.productSuggestionUrl();
        contentSearchEndpoint = searchBarConfiguration.contentSearchEndpoint();
        contentSuggestionUrl = searchBarConfiguration.contentSuggestionUrl();
        orderSearchEndpoint = searchBarConfiguration.orderSearchEndpoint();
        quoteSearchEndpoint = searchBarConfiguration.quoteSearchEndpoint();
        orderDcpLookupEndpoint = searchBarConfiguration.orderDcpLookupEndpoint();
        quoteDcpLookupEndpoint = searchBarConfiguration.quoteDcpLookupEndpoint();
        orderValidateResponseEndPoint = searchBarConfiguration.orderValidateResponseEndPoint();
        quoteValidateResponseEndPoint = searchBarConfiguration.quoteValidateResponseEndPoint();
        orderPartialEndPoint = searchBarConfiguration.orderPartialEndPoint();
        quotePartialEndPoint = searchBarConfiguration.quotePartialEndPoint();
        spaSearchEndpoint = searchBarConfiguration.spaSearchEndpoint();
        typeAheadDomain = searchBarConfiguration.typeAheadDomain();
        dcpDomain = redirectConfiguration.dcpDomain();
        typeAheadSearchTermSuffix = searchBarConfiguration.typeAheadSearchTermSuffix();
        typeAheadXDomainScript = searchBarConfiguration.typeAheadXDomainScript();
        typeAheadProxyScript = searchBarConfiguration.typeAheadProxyScript();

        searchDomain = searchBarConfiguration.searchDomain();
        legacySearchEndpoint = searchBarConfiguration.legacySearchEndpoint();
        searchKeywordParameter = searchBarConfiguration.searchKeywordParameter();
        searchRefinementsParameter = searchBarConfiguration.searchRefinementsParameter();
        searchBParameter = searchBarConfiguration.searchBParameter();
        contentSearchTab = searchBarConfiguration.contentSearchTab();
        dcpDashboardPage = redirectConfiguration.dcpDashboardPage();
        quoteListingPage = redirectConfiguration.quoteListingPage();
        quoteDetailPage = redirectConfiguration.quoteDetailPage();
        quotePreviewPage = redirectConfiguration.quotePreviewPage();
        orderListingPage = redirectConfiguration.orderListingPage();
        orderDetailPage = redirectConfiguration.orderDetailPage();
        shopDomainPage = redirectConfiguration.shopDomainPage();
        actionItemsEndpoint = serviceEndPointsConfiguration.actionItemsEndpoint();
        quoteDetailsXLSEndpoint = serviceEndPointsConfiguration.quoteDetailsXLSEndpoint();

        buildComonConfigurationsConfigs();
    }

    private void buildComonConfigurationsConfigs() {
        CommonConfigurations commonConfigurations = page.adaptTo(ConfigurationBuilder.class).as(CommonConfigurations.class);
        FormConfigurations formConfigurations = page.adaptTo(ConfigurationBuilder.class).as(FormConfigurations.class);

        productEmptyImageUrl = commonConfigurations.productEmptyImageUrl();
        enableQualtricsCode = commonConfigurations.enableQualtricsCode();
        agGridLicenseKey = commonConfigurations.agGridLicenseKey();
        allowedFileExtensions = String.join(",", Arrays.asList(formConfigurations.allowedFileExtensions()));
        fileThresholdInMB = String.valueOf(formConfigurations.fileThresholdInMB());
    }

    public String getUiServiceDomain() {
        return uiServiceDomain;
    }

    public String getCatalogEndpoint() {
        return catalogEndpoint;
    }

    public String getAuthorizationPageURL() {
        return authorizationPageURL;
    }

    public String getLoginEndpoint() {
        return loginEndpoint;
    }

    public String getPingAppId() {
        return pingAppId;
    }

    public String getActiveCartEndpoint() {
        return activeCartEndpoint;
    }

    public String getMyConfigurationsEndpoint() {
        return myConfigurationsEndpoint;
    }

    public String getMyOrdersEndpoint() {
        return myOrdersEndpoint;
    }

    public String getMyQuotesEndpoint() {
        return myQuotesEndpoint;
    }

    public String getMyDealsEndpoint() {
        return myDealsEndpoint;
    }

    public String getMyOrderStatusEndpoint() {
        return myOrderStatusEndpoint;
    }

    public String getMyRenewalsEndpoint() {
        return myRenewalsEndpoint;
    }

    public String getTopItemsEndpoint() {
        return topItemsEndpoint;
    }

    public String getCreateQuoteEndpoint() {
        return createQuoteEndpoint;
    }

    public String getReplaceCartEndpoint() {
        return replaceCartEndpoint;
    }

    public String getCartDetailsEndpoint() {
        return cartDetailsEndpoint;
    }

    public String getPricingConditionsEndPoint() {
        return pricingConditionsEndPoint;
    }

    public String getOrderLevelsForQuotePreviewEndpoint() {
        return orderLevelsForQuotePreviewEndpoint;
    }

    public String getEstimatedIdListEndpoint() {
        return estimatedIdListEndpoint;
    }

    public String getEstimatedIdDetailsEndpoint() {
        return estimatedIdDetailsEndpoint;
    }

    public String getSavedCartsEndpoint() {
        return savedCartsEndpoint;
    }

    public String getQuoteGridEndpoint() {
        return quoteGridEndpoint;
    }

    public String getQuoteDetailEndpoint() {
        return quoteDetailEndpoint;
    }

    public String getVendorConnectionEndpoint() {
        return vendorConnectionEndpoint;
    }

    public String getOrderGridEndpoint() {
        return orderGridEndpoint;
    }

    public String getQuotesPreviewEndPoint() {
        return quotesPreviewEndPoint;
    }

    public String getQuickQuoteEndpoint() {
        return quickQuoteEndpoint;
    }

    public String getQuotesPreviewPricingEndPoint() {
        return quotesPreviewPricingEndPoint;
    }

    public String getAccountAdressEndPoint() {
        return accountAdressEndPoint;
    }

    public String getConfigurationsEndpoint() {
        return configurationsEndpoint;
    }

    public String getPuchOutEndpoint(){
        return puchOutEndpoint;
    }

    public String getShopDomain() {
        return shopDomain;
    }

    public String getCartURL() {
        return cartURL;
    }

    public String getExpressCheckoutRedirectUrl(){ return expressCheckoutRedirectUrl; }

    public String getTdPartSmart() {
        return tdPartSmart;
    }

    public String getAnalyticsSnippet() {
        return analyticsSnippet;
    }

    public String getAllSearchEndpoint() {
        return allSearchEndpoint;
    }

    public String getAllSuggestionUrl() {
        return allSuggestionUrl;
    }

    public String getProductSearchEndpoint() {
        return productSearchEndpoint;
    }

    public String getProductSuggestionUrl() {
        return productSuggestionUrl;
    }

    public String getContentSearchEndpoint() {
        return contentSearchEndpoint;
    }

    public String getContentSuggestionUrl() {
        return contentSuggestionUrl;
    }

    public String getOrderSearchEndpoint() {
        return orderSearchEndpoint;
    }

    public String getQuoteSearchEndpoint() {
        return quoteSearchEndpoint;
    }

    public String getOrderDcpLookupEndpoint() {
        return orderDcpLookupEndpoint;
    }

    public String getQuoteDcpLookupEndpoint() {
        return quoteDcpLookupEndpoint;
    }

    public String getQuotePartialEndPoint() {
        return quotePartialEndPoint;
    }

    public String getOrderValidateResponseEndPoint() {
        return orderValidateResponseEndPoint;
    }

    public String getOrderPartialEndPoint() {
        return orderPartialEndPoint;
    }

    public String getQuoteValidateResponseEndPoint() {
        return quoteValidateResponseEndPoint;
    }

    public String getSpaSearchEndpoint() {
        return spaSearchEndpoint;
    }

    public String getTypeAheadDomain() {
        return typeAheadDomain;
    }

    public String getDcpDomain() {return dcpDomain;}

    public String getTypeAheadSearchTermSuffix() {
        return typeAheadSearchTermSuffix;
    }

    public String getTypeAheadXDomainScript() {
        return typeAheadXDomainScript;
    }

    public String getTypeAheadProxyScript() {
        return typeAheadProxyScript;
    }

    public String getSearchDomain() {
        return searchDomain;
    }

    public String getSearchKeywordParameter() {
        return searchKeywordParameter;
    }

    public String getLegacySearchEndpoint() {
        return legacySearchEndpoint;
    }

    public String getSearchRefinementsParameter() {
        return searchRefinementsParameter;
    }

    public String getSearchBParameter(){return searchBParameter;}

    public String getContentSearchTab(){return contentSearchTab;}

    public String getDcpDashboardPage(){return dcpDashboardPage;}

    public String getQuoteListingPage(){return quoteListingPage;}

    public String getQuoteDetailPage(){return quoteDetailPage;}

    public String getQuotePreviewPage(){return quotePreviewPage;}

    public String getOrderListingPage(){return orderListingPage;}

    public String getOrderDetailPage(){return orderDetailPage;}

    public String getShopDomainPage() {return shopDomainPage;}    

    public String getOrderDetailEndpoint() { return orderDetailEndpoint;}

    public String getDownloadAllInvoicesEndpoint() {
        return downloadAllInvoicesEndpoint;
    }

    public String getDownloadInvoiceEndpoint() {
        return downloadInvoiceEndpoint;
    }

    public String getDealsForEndpoint() {
        return dealsForEndpoint;
    }

    public String getActionItemsEndpoint() {
        return actionItemsEndpoint;
    }

    public String getQuoteDetailsXLSEndpoint() {
        return quoteDetailsXLSEndpoint;
    }

    public String getProductEmptyImageUrl() {
        return productEmptyImageUrl;
    }

    public String getDownloadOrderDetailsEndpoint() {
        return downloadOrderDetailsEndpoint;
    }

    public String getRenewalsGridEndpoint() {
        return renewalsGridEndpoint;
    }

    public String getRenewalDetailLineItemEndpoint(){
        return renewalDetailLineItemEndpoint;
    }

    public String getRenewalDetailsEndpoint(){
        return renewalDetailsEndpoint;
    }
    
    public String getExportXLSRenewalsEndpoint(){
        return exportXLSRenewalsEndpoint;
    }

    public String getSetVendorConnectionEndpoint() { return setVendorConnectionEndpoint; }

    public String getVendorDisconnectEndpoint() { return vendorDisconnectEndpoint; }

    public String getAgGridLicenseKey() {
        return agGridLicenseKey;
    }

    public String getAllowedFileExtensions() {
        return allowedFileExtensions;
    }

    public String getFileThresholdInMB() {
        return fileThresholdInMB;
    }

    public boolean isEnableQualtricsCode() {
        return enableQualtricsCode;
    }

}

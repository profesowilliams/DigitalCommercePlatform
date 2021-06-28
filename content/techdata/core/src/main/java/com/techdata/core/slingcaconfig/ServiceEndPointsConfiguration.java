package com.techdata.core.slingcaconfig;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

@Configuration(
    label = "Service Endpoint Configuration",
    description = "Configuration can be made per website")
public @interface ServiceEndPointsConfiguration {

    @Property(label = "UI Service Domain", description = "UI Service Domain", order = 1)
    String uiServiceDomain();

    @Property(label = "Catalog Endpoint", description = "Catalog Endpoint", order = 2)
    String catalogEndpoint();

    @Property(label = "Authorization Page URL", description = "Authorization Page URL", order = 3)
    String authorizationPageURL();

    @Property(label = "Login Endpoint", description = "Login Endpoint", order = 4)
    String loginEndpoint();

    @Property(label = "Ping App Id", description = "Ping App Id", order = 5)
    String pingAppId();

    @Property(label = "Active Cart Endpoint", description = "Active Cart Endpoint", order = 6)
    String activeCartEndpoint();

    @Property(label = "My Configurations Endpoint", description = "My Configurations Endpoint", order = 7)
    String myConfigurationsEndpoint();

    @Property(label = "My Orders Endpoint", description = "My Orders Endpoint", order = 8)
    String myOrdersEndpoint();

    @Property(label = "My Quotes Endpoint", description = "My Quotes Endpoint", order = 9)
    String myQuotesEndpoint();

    @Property(label = "My Deals Endpoint", description = "My Deals Endpoint", order = 10)
    String myDealsEndpoint();

    @Property(label = "My Renewals Endpoint", description = "My Renewals Endpoint", order = 11)
    String myRenewalsEndpoint();

    @Property(label = "Top Items Endpoint", description = "Top Items Endpoint", order = 12)
    String topItemsEndpoint();

    @Property(label = "Create Quote Endpoint", description = "Create Quote Endpoint", order = 13)
    String createQuoteEndpoint();

    @Property(label = "Cart Details Endpoint", description = "Cart Details Endpoint", order = 14)
    String cartDetailsEndpoint();

    @Property(label = "Pricing Conditions Endpoint", description = "Pricing Conditions Endpoint", order = 15)
    String pricingConditionsEndPoint();

    @Property(label = "Estimated Id List Endpoint", description = "Estimated Id List Endpoint", order = 16)
    String estimatedIdListEndpoint();

    @Property(label = "Estimated Id Details Endpoint", description = "Estimated Id Details Endpoint", order = 17)
    String estimatedIdDetailsEndpoint();

    @Property(label = "Saved Carts Endpoint", description = "Saved Carts Endpoint", order = 18)
    String savedCartsEndpoint();

    @Property(label = "Quote Grid Endpoint", description = "Quote Grid Endpoint", order = 19)
    String quoteGridEndpoint();

    @Property(label = "Order Grid Endpoint", description = "Order Grid Endpoint", order = 20)
    String orderGridEndpoint();

    @Property(label = "Quote Detail Endpoint", description = "Quote Detail Endpoint", order = 21)
    String quoteDetailEndpoint();

    @Property(label = "Vendor connection Endpoint", description = "Vendor Connection Endpoint ", order = 22)
    String vendorConnectionEndpoint();
}
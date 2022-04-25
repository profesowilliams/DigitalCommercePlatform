package com.tdscore.core.slingcaconfig;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

@Configuration(
        label = "Redirect Configuration",
        description = "Redirect Configuration can be made per website")
public @interface RedirectConfiguration {

    @Property(label = "DCP Dashboard Page", description = "DCP Dashboard Page", order = 1)
    String dcpDashboardPage();

    @Property(label = "Quote Listing Page", description = "Quote Listing Page", order = 2)
    String quoteListingPage();

    @Property(label = "Quote Detail Page", description = "Quote Detail Page", order = 3)
    String quoteDetailPage();

    @Property(label = "Quote Preview Page", description = "Quote Preview Page", order = 4)
    String quotePreviewPage();

    @Property(label = "Order Listing Page", description = "Order Listing Page", order = 5)
    String orderListingPage();

    @Property(label = "Order Detail Page", description = "Order Detail Page", order = 6)
    String orderDetailPage();
    
    @Property(label = "Shop Domain", description = "Shop Domain", order = 7)
    String shopDomainPage();

    @Property(label = "DCP Domain", description = "DCP Domain")
    String dcpDomain();


}
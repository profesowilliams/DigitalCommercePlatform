package com.techdata.core.slingcaconfig;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

@Configuration(
    label = "Global Search Bar Configuration",
    description = "Global Serach Configuration can be made per website")
public @interface SearchBarConfiguration {

    @Property(label = "All Search", description = "All Search", order = 1)
    String allSearchEndpoint();

    @Property(label = "Products Search", description = "Products Search", order = 2)
    String productSearchEndpoint();

    @Property(label = "Content Search", description = "Content Search", order = 3)
    String contentSearchEndpoint();

    @Property(label = "Quotes Search", description = "Quotes Search", order = 4)
    String quoteSearchEndpoint();

    @Property(label = "Orders Search", description = "Orders Search", order = 5)
    String orderSearchEndpoint();

    @Property(label = "SPA Search", description = "SPA Search", order = 6)
    String spaSearchEndpoint();



}
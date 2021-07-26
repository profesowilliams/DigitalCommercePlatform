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

    @Property(label = "Typeahead Domain", description = "Typeahead Domain", order = 7)
    String typeAheadDomain();

    @Property(label = "Typeahead Endpoint", description = "Typeahead Endpoint", order = 8)
    String typeAheadEndpoint();

    @Property(label = "Typeahead Keyword Parameter", description = "Typeahead Keyword Parameter", order = 9)
    String typeAheadKeyword();

    @Property(label = "Search Domain", description = "Search Domain", order = 10)
    String searchDomain();

    @Property(label = "Legacy Search Endpoint", description = "Legacy Search Endpoint", order = 11)
    String legacySearchEndpoint();

    @Property(label = "Search Keyword Parameter", description = "Search Keyword Parameter", order = 12)
    String searchKeywordParameter();

    @Property(label = "Search Refinements Parameter", description = "Search Refinements Parameter", order = 13)
    String searchRefinementsParameter();

    @Property(label = "Search b Parameter", description = "Search b Parameter", order = 14)
    String searchBParameter();

    @Property(label = "Content Search Tab", description = "Content Search Tab", order = 15)
    String contentSearchTab();



}
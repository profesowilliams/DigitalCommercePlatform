package com.techdata.core.slingcaconfig;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

@Configuration(
    label = "Global Search Bar Configuration",
    description = "Global Serach Configuration can be made per website")
public @interface SearchBarConfiguration {

    @Property(label = "All Search", description = "All Search")
    String allSearchEndpoint();

    @Property(label = "All Suggestion Url", description = "All Suggestion Url")
    String allSuggestionUrl();

    @Property(label = "Products Search", description = "Products Search")
    String productSearchEndpoint();

    @Property(label = "Products Suggestion Url", description = "Products Suggestion Url")
    String productSuggestionUrl();

    @Property(label = "Content Search", description = "Content Search")
    String contentSearchEndpoint();

    @Property(label = "Content Suggestion Url", description = "Content Suggestion Url")
    String contentSuggestionUrl();

    @Property(label = "Orders Search", description = "Orders Search")
    String orderSearchEndpoint();

    @Property(label = "Quote Search Endpoint", description = "Quote Search Endpoint")
    String quoteSearchEndpoint();

    @Property(label = "SPA Search", description = "SPA Search")
    String spaSearchEndpoint();

    @Property(label = "Typeahead Domain", description = "Typeahead Domain")
    String typeAheadDomain();

    @Property(label = "Typeahead Endpoint", description = "Typeahead Endpoint")
    String typeAheadEndpoint();

    @Property(label = "Typeahead Keyword Parameter", description = "Typeahead Keyword Parameter")
    String typeAheadKeyword();

    @Property(label = "Search Domain", description = "Search Domain")
    String searchDomain();

    @Property(label = "Legacy Search Endpoint", description = "Legacy Search Endpoint")
    String legacySearchEndpoint();

    @Property(label = "Search Keyword Parameter", description = "Search Keyword Parameter")
    String searchKeywordParameter();

    @Property(label = "Search Refinements Parameter", description = "Search Refinements Parameter")
    String searchRefinementsParameter();

    @Property(label = "Search b Parameter", description = "Search b Parameter")
    String searchBParameter();

    @Property(label = "Content Search Tab", description = "Content Search Tab")
    String contentSearchTab();
}

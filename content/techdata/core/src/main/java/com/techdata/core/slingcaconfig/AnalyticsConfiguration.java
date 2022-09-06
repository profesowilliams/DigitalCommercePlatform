package com.techdata.core.slingcaconfig;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

@Configuration(
        label = "Analytics Configuration",
        description = "Configuration can be made per website")
public @interface AnalyticsConfiguration {

    @Property(label = "Analytics Snippet", description = "Add Analytics Snippet")
    String analyticsSnippet();

    @Property(label = "Enable Google Tag Manager(GTM)", description = "Check to enable GTM, disabled by default.")
    boolean enableGoogleTagManager();

    @Property(label = "GTM Head JS Snippet", description = "Provides script that will be embedded in Head section of the page.")
    String gtmHeadJSScript();

    @Property(label = "GTM Body JS Snippet", description = "Provides script that will be embedded in Body section of the page.")
    String gtmBodyJSScript();
}

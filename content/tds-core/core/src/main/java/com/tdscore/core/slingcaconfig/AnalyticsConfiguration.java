package com.tdscore.core.slingcaconfig;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

@Configuration(
        label = "Analytics Configuration",
        description = "Configuration can be made per website")
public @interface AnalyticsConfiguration {

    @Property(label = "Analytics Snippet", description = "Add Analytics Snippet")
    String analyticsSnippet();

}

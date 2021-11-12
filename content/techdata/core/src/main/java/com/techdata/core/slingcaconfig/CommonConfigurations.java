package com.techdata.core.slingcaconfig;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

@Configuration(
    label = "Common Configurations",
    description = "Common Configurations")
public @interface CommonConfigurations {

    @Property(label = "Product Empty Image Url", description = "Product Empty Image Url")
    String productEmptyImageUrl();
}

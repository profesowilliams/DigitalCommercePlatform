package com.techdata.core.slingcaconfig;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

@Configuration(
    label = "Common Configurations",
    description = "Common Configurations")
public @interface CommonConfigurations {

    @Property(label = "Product Empty Image Url edited", description = "Product Empty Image Url")
    String productEmptyImageUrl();

    @Property(label = "AG-Grid License Key", description = "AG-Grid License Key")
    String agGridLicenseKey();
    
}

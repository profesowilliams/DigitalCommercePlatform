package com.tdscore.core.slingcaconfig;

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

    @Property(label = "Enable Qualtrics Code", description = "Check to enable Qualtrics code.")
    boolean enableQualtricsCode() default false;

}

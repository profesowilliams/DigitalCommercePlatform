package com.techdata.core.slingcaconfig;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

@Configuration(
    label = "Mini Cart Configuration",
    description = "Configuration can be made per website")
public @interface MiniCartConfiguration {

    @Property(label = "Shop Domain", description = "Shop Domain", order = 1)
    String shopDomain();

    @Property(label = "Cart URL", description = "Cart URL", order = 2)
    String cartURL();

    @Property(label = "TD Part Smart", description = "TD Part Smart", order = 3)
    String tdPartSmart();


}
package com.tdscore.core.slingcaconfig;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

@Configuration(
        label = "Catalog Service Configuration",
        description = "Configuration can be made per website")
public @interface CatalogServiceConfiguration {

    @Property(label = "Product Menu Link Prefix", description = "Provide prefix domain")
    String productMenuLinkPrefix() default "https://shop.cstenet.com/products/category/category";

}

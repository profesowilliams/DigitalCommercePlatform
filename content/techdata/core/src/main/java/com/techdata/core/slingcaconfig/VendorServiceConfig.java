package com.techdata.core.slingcaconfig;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Vendor Service Configuration")
public @interface VendorServiceConfig {
    @AttributeDefinition(name = "Vendor Root Page Path", description = "Provide vendor root page path from language master.")
    String rootPagePath() default "/content/techdata/language-masters/en/vendors";

    @AttributeDefinition(name = "Vendor Content Fragment Path", description = "Provide vendor content fragment path.")
    String contentFragmentPath() default "/content/dam/techdata/tech-data-dot-com/global/content-fragments/vendors";

    @AttributeDefinition(name = "Vendors Import API", description = "Provide import API for vendors")
    String importAPI() default "http://localhost:3000/vendors";
}

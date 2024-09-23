package com.techdata.core.slingcaconfig;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;
import org.osgi.service.metatype.annotations.AttributeDefinition;

@Configuration(label = "Feature Flags Configuration", description = "Enable and disable feature flags")
public @interface FeatureFlagsConfiguration {

    @Property(label = "Disable checks for DCP Access", description = "Helps to disable DCP checks for access for components, enabled by default.")
    boolean disableChecksForDCPAccess() default false;

    @AttributeDefinition(name = "Disable Entitlements List")
    String disableEntitlementsList() default StringUtils.EMPTY;
}

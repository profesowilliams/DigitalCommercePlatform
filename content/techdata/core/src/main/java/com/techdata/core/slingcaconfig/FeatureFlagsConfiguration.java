package com.techdata.core.slingcaconfig;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

@Configuration(label = "Feature Flags Configuration", description = "Enable and disable feature flags")
public @interface FeatureFlagsConfiguration {
    
    @Property(label = "Http Only Enabled Flag", description = "Allow/Disallow cookies from being sent as part of requests.")
    boolean httpOnlyEnabled() default false;

    @Property(label = "Extra Reload Disabled Flag", description = "Disable the extra reload that happens upon signing in to DCP.")
    boolean extraReloadDisabled() default false;

}

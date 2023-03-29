package com.tdscore.core.slingcaconfig;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

@Configuration(
    label="Ecommerce Authentication Configuration",
    description="Configuration can be made per website"
)
public @interface EcommerceAuthenticationConfiguration {
    @Property(label="Login Endpoint", description="Provide login endpoint")
    String loginEndpoint();

    @Property(label="Get User Endpoint", description="Provide get user endpoint")
    String getUserEndpoint();
}

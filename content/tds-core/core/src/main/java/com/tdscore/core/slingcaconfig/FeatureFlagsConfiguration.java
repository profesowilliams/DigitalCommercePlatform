package com.tdscore.core.slingcaconfig;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;
import org.osgi.service.metatype.annotations.AttributeDefinition;

@Configuration(label = "Feature Flags Configuration", description = "Enable and disable feature flags")
public @interface FeatureFlagsConfiguration {

    @Property(label = "Environment Header Enabled Flag", description = "Enable Evnironment header to be sent as part of requests.")
    boolean environmentEnabled() default false;

    @Property(label = "Disable checks for DCP Access", description = "Helps to disable DCP checks for access for components, enabled by default.")
    boolean disableChecksForDCPAccess() default false;

    @AttributeDefinition(name = "Disable Entitlements List")
    String disableEntitlementsList() default StringUtils.EMPTY;

    @Property(label = "Disable Impersonate Account Request Header", description = "Disables the inclusion of the impersonateAccount header on Order Requests in Renewals APJ.")
    boolean disableImpersonateAccountRequestHeader() default true;

    @Property(label = "Disable Multiple Agreement", description = "Helps to disable Multiple Agreement Support, enabled by default.")
    boolean disableMultipleAgreement() default false;

    @Property(label = "Enable Share Option to Ellipsis Menu", description = "Helps to enable Share Option to Ellipsis Menu in Renewals grid.")
    boolean enableShareOption() default false;
    
    @Property(label = "Enable New Purchase Button Action", description = "Helps to enable New purchase button in Renewals grid.")
    boolean enableNewPurchaseAction() default false;
    
    @Property(label = "Enable Import", description = "Helps to enable Import button in Renewals grid.")
    boolean enableImport() default false;

    @Property(label = "Enable Request Quote Option", description = "Helps to enable Request Quote Option in Renewals grid and Renewals details.")
    boolean enableRequestQuote() default false;

    @Property(label = "Enable Archive Quote Option", description = "Helps to enable Archive Quote Option in Renewals grid and Renewals details.")
    boolean enableArchiveQuote() default false;

    @Property(label = "Enable Revise Quote Option", description = "Helps to enable Revise Quote Option in Renewals grid and Renewals details.")
    boolean enableReviseOption() default false;

    @Property(label = "Enable Entitlement Country Validation", description = "Helps to enable Entitlement Country Validation in Renewals grid and Renewals details.")
    boolean enableEntitlementCountryValidation() default false;
}

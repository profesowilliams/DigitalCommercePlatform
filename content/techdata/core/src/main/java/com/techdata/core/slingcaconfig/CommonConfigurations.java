package com.techdata.core.slingcaconfig;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

@Configuration(
    label = "Common Configurations",
    description = "Common Configurations")
public @interface CommonConfigurations {

    @Property(label = "Product Empty Image Url", description = "Product Empty Image Url")
    String productEmptyImageUrl();

    @Property(label = "Email Subject", description = "Email Subject")
    String emailSubject();

    @Property(label = "From Email", description = "From Email")
    String fromEmail();

    @Property(label = "To Emails, comma seperated", description = "To Emails, comma seperated")
    String toEmails();

    @Property(label = "Catalog Endpoint", description = "Catalog Endpoint")
    String catalogEndpoint();

    @Property(label = "Name of Email address field", description = "Name of Email address field")
    String submitterEmailFieldName();

    @Property(label = "Confirmation Email Body", description = "Confirmation Email Body")
    String confirmationEmailBody();

    @Property(label = "Path of Email template for internal email", description = "Path of Email template for internal email")
    String internalEmailTemplatePath();

    @Property(label = "Path of Email template for confirmation email sent to submitter", description = "Path of Email template for confirmation email sent to submitter")
    String confirmationEmailTemplatePath();

    @Property(label = "Confirmation Email Subject", description = "Confirmation Email Subject")
    String confirmationEmailSubject();

}

package com.techdata.core.slingcaconfig;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

@Configuration(
    label = "Common Configurations",
    description = "Common Configurations")
public @interface CommonConfigurations {

    @Property(label = "Product Empty Image Url edited", description = "Product Empty Image Url")
    String productEmptyImageUrl();

    @Property(label = "Email Subject", description = "Email Subject")
    String emailSubject();

    @Property(label = "From Email", description = "From Email")
    String fromEmail();

    @Property(label = "Internal Emails", description = "Internal Emails")
    String[] toEmails();

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

    @Property(label = "Allowed File Extensions", description = "Specify comma separated list, like .pdf,.zip")
    String[] allowedFileExtensions() default {".pdf",".zip"};

    @Property(label = "Allowed File Content types", description = "Specify comma separated list, like application/pdf, application/zip")
    String[] allowedFileContentTypes() default {"application/pdf", "application/zip"};

    @Property(label = "File Threshold in MB", description = "Specify upload file threshold size for form")
    int fileThresholdInMB() default 10;

    @Property(label = "Target Groups Array", description = "Target Groups Array")
    String[] formSubmissionTargetGroups();

    @Property(label = "Text field regex field", description = "Java String regex to whitelist incoming form characters.")
    String textfieldRegexString() default "^[-a-zA-Z0-9.,;_@=%:\r\n \\\\/()!$£*+{}?|]+$";

}

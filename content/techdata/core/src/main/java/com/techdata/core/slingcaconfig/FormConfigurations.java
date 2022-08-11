package com.techdata.core.slingcaconfig;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

@Configuration(
    label = "Form Configurations",
    description = "Form and Email Configurations")
public @interface FormConfigurations {

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
    String confirmationEmailBody() default StringUtils.EMPTY;

    @Property(label = "Path of Email template for internal email", description = "Path of Email template for internal email")
    String internalEmailTemplatePath() default StringUtils.EMPTY;

    @Property(label = "Generic Path of Email template for confirmation email sent to submitter", description = "APAC Path of Email template for confirmation email sent to submitter")
    String genericConfirmationEmailTemplatePath() default "/etc/notification/email/generic-confirmation-email.html";

    @Property(label = "APAC Path of Email template for confirmation email sent to submitter", description = "Generic Path of Email template for confirmation email sent to submitter")
    String apacConfirmationEmailTemplatePath() default "/etc/notification/email/apac-confirmation-email.html";

    @Property(label = "Confirmation Email Subject", description = "Confirmation Email Subject")
    String confirmationEmailSubject() default StringUtils.EMPTY;

    @Property(label = "Confirmation Help Desk", description = "Confirmation Help Desk")
    String confirmationHelpDesk() default StringUtils.EMPTY;

    @Property(label = "Allowed File Extensions", description = "Specify comma separated list, like .pdf,.zip")
    String[] allowedFileExtensions() default {".pdf"};

    @Property(label = "Allowed File Content types", description = "Specify comma separated list, like application/pdf, application/zip")
    String[] allowedFileContentTypes() default {"application/pdf"};

    @Property(label = "File Threshold in MB", description = "Specify upload file threshold size for form")
    int fileThresholdInMB() default 10;

    @Property(label = "Number of File Attachements Available", description = "Specify the number of files can be uploaded on form.")
    int filesCount() default 10;

    @Property(label = "Target Groups Array", description = "Target Groups Array")
    String[] formSubmissionTargetGroups() default StringUtils.EMPTY;

    @Property(label = "Blacklist Text field regex field", description = "Java String regex to blacklist incoming form characters. Double quote char is not allowed.")
    String textFieldRegexString() default "[|]";

    @Property(label = "Encoded chars", description = "Chars and their encoded values. Use == as delimeter, eg: &==&amp.")
    String[] charsWithEncodedValues() default
            {"&==&amp;","<==&lt;",">==&gt;","\"==&quot;","'==&#x27;", "/==&#x2F;"};

    @Property(label = "APAC Form Parameter List", description = "The list of parameters used on the form",
            property = {"widgetType=textarea"})
    String apacFormParameterList()  default
            "techDataAccountRep#registerCashOrCreditAccount#creditLimit#companyStructure#subsidiaryBranch#" +
            "trustee#companyName#companyWebsite#primaryBusiness#specialization#natureOfBusiness#annualTechRevGoal#" +
            "vendor#businessRegistrationNumber#authorisedShareCapital#paidUpCapital#dateOfIncorporation#registeredAddress#" +
            "countryBusinessInfo#stateBusinessInfo#cityBusinessInfo#postalCodeBusinessInfo#sameInfoForBillingNShipping#" +
            "billToAddress#countryBillToAddress#stateBillToAddress#cityBillToAddress#postalCodeBillToAddress#shipToAddress#" +
            "countryShipToAddress#stateShipToAddress#cityShipToAddress#postalCodeShipToAddress#purchasingOfficerContactName#" +
            "contactPhone#faxContact#accountsPayableContactName#contactEmailAccountsPayable#contactEmailAccountsPayableSOA#" +
            "contactEmailAccountsPayableInvoice#contactPhoneAccountsPayable#faxAccountsPayable#mdCeoName#emailMDCeo#" +
            "telephoneMDCeo#cfoName#emailMDCeo#telephoneMDCeo#shareholders#createCloudAccount#whatPublicCloudVendors#" +
            "AgreeToTerms#InfoProvidedAboveIsCorrect#signature#signatureDate#agreeTerms#agreeSOA";

    @Property(label = "Send form submission email to the customer?", description = "Indicate whether to send an email to the customer confirming the submission")
    boolean shouldSendCustomerSubmissionEmail() default false;

    @Property(label = "Paths for Required Attachments", description = "region|/path/to/file/attachment1,/path/to/file/attachment2")
    String[] requiredAttachmentPaths();    
}
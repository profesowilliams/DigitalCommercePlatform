package com.tdscore.core.servlets;


import com.adobe.acs.commons.email.EmailService;
import com.day.cq.wcm.api.Page;
import com.tdscore.core.models.ExtractBinaryAsset;
import com.tdscore.core.slingcaconfig.FormConfigurations;
import com.tdscore.core.slingcaconfig.ServiceEndPointsConfiguration;
import com.tdscore.core.util.Constants;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpStatus;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.caconfig.ConfigurationBuilder;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.activation.DataSource;
import javax.mail.util.ByteArrayDataSource;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.*;
import java.util.regex.Pattern;

@Component(
        immediate = true,
        service = Servlet.class,
        property = {
                "service.description=Form Submission Servlet",
                "service.vendor=tdsynnex.com",
                "sling.servlet.methods=" + HttpConstants.METHOD_POST,
                "sling.servlet.resourcetypes=tds-core/components/tdpostform"
        }
)
public class FormServlet extends SlingAllMethodsServlet {
        private static final Logger LOG = LoggerFactory.getLogger(FormServlet.class);
        private static final String FILE_PARAM_NAME = "file";
        private static final String CONFIRMATION_EMAIL_BODY_PARAM_NAME = "confirmationEmailBody";
        private static final String CONFIRMATION_EMAIL_HELP_DESK = "confirmationHelpDesk";
        private static final String CONFIRMATION_EMAIL_SUBJECT_PARAM_NAME = "confirmationSubject";
        private static final String INTERNAL_EMAIL_SUBJECT_PARAM_NAME = "internalEmailSubject";
        private static final int ONE_MB_IN_BYTES = 1000000;
        public static final String A_TO_Z_LOWERCASE = "a-z";
        private static final String ENCODE_DELIMITER = "==";
        @Reference

        private transient EmailService emailService;
        private String[] toEmailAddresses;
        private String submitterEmailFieldName = StringUtils.EMPTY;
        private String internalEmailTemplatePath = StringUtils.EMPTY;
        private String confirmationEmailTemplatePath = StringUtils.EMPTY;
        private Map<String, String[]> formSubmissionTargetGroups;
        private Map<String, String[]> requiredAttachmentPaths;
        private int thresholdFileSize = 10;
        private List<String> allowedFileExtensions = new ArrayList<>();
        private List<String> allowedFileContentTypes = new ArrayList<>();
        private Map<String,String> charsEncodedMap = new HashMap<>();
        private String blacklistCharsRegexExpr;

        @Override
        protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
                PrintWriter out = response.getWriter();
                ResourceResolver resourceResolver = request.getResourceResolver();
                Resource resource = resourceResolver.getResource(Constants.TECHDATA_CONTENT_PAGE_ROOT);
                Page page = resource.adaptTo(Page.class);
                ServiceEndPointsConfiguration serviceEndPointsConfiguration =
                        page.adaptTo(ConfigurationBuilder.class).as(ServiceEndPointsConfiguration.class);
                out.print(serviceEndPointsConfiguration.downloadInvoiceEndpoint());
        }

        @Override
        protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
                Map<String, String> emailParams = new HashMap<>();
                ResourceResolver resourceResolver = request.getResourceResolver();
                Map<String, DataSource> attachments = new HashMap<>();
                try
                {
                        final boolean isMultipart = org.apache.commons.fileupload.servlet.ServletFileUpload.isMultipartContent(request);

                        if (isMultipart) {
                                LOG.info("Received Multi-part form data for processing");
                                StringBuilder currentPagePath = getCurrentPageParamValue(request);
                                if(StringUtils.isEmpty(currentPagePath.toString())) {
                                        currentPagePath.append(Constants.TECHDATA_CONTENT_PAGE_ROOT);
                                }
                                Resource resource = resourceResolver.getResource(currentPagePath.toString());
                                FormConfigurations formConfigurations = getCAConfigFormEmailObject(resource);
                                if(formConfigurations != null) {
                                        populateDefaultValuesToEmailParams(emailParams, formConfigurations.apacFormParameterList());
                                        requiredAttachmentPaths = getPipeSplitMap(formConfigurations.requiredAttachmentPaths());
                                        prepareEncodedChars(formConfigurations);
                                        prepareEmailRequestFromFormData(request.getRequestParameterMap(), attachments, emailParams);
                                        populateEmailAttributesFromCAConfig(formConfigurations, emailParams);
                                        handleAttachmentsInEmail(formConfigurations, emailParams);
                                        thresholdFileSize = formConfigurations.fileThresholdInMB();
                                        allowedFileExtensions = Arrays.asList(formConfigurations.allowedFileExtensions());
                                        allowedFileContentTypes = Arrays.asList(formConfigurations.allowedFileContentTypes());
                                        handleRequiredAttachments(request, emailParams, attachments);
                                        blacklistCharsRegexExpr = formConfigurations.textFieldRegexString();
                                        if (isValidFileInEmailRequest(request)) {
                                                sendEmailWithFormData(toEmailAddresses, emailParams, submitterEmailFieldName,
                                                        internalEmailTemplatePath, confirmationEmailTemplatePath, attachments);
                                        } else {
                                                LOG.info("Ignored:: Wrong form/email request with invalid upload file size or extension..");
                                                sendEmailWithFormData(toEmailAddresses, emailParams, submitterEmailFieldName,
                                                        internalEmailTemplatePath, confirmationEmailTemplatePath, null);
                                        }
                                }
                        }
                }
                catch (CustomFormException e) {
                        LOG.error("Exception occurred during form submission", e);
                        response.sendError(HttpStatus.SC_UNSUPPORTED_MEDIA_TYPE, e.getMessage());
                }
        }

        private StringBuilder getCurrentPageParamValue(SlingHttpServletRequest request) {
                StringBuilder currentPagePath = new StringBuilder();
                RequestParameter[] requestParameters = request.getRequestParameterMap().get("currentpage");
                if(requestParameters != null) {
                        for (RequestParameter rp : requestParameters) {
                                if (StringUtils.isNotEmpty(rp.toString())) {
                                        currentPagePath.append(rp.toString());
                                }
                        }
                }
                return currentPagePath;
        }

        private void populateDefaultValuesToEmailParams(Map<String, String> emailParams, String apacFormParameterList) {
                if(StringUtils.isNotEmpty(apacFormParameterList)) {
                        String[] paramList = apacFormParameterList.split("#");
                        for (String param : paramList) {
                                emailParams.put(param, StringUtils.EMPTY);
                        }
                }
        }

        private FormConfigurations getCAConfigFormEmailObject(Resource resource) {
                if(resource == null || resource.adaptTo(Page.class) == null) return null;
                Page page = resource.adaptTo(Page.class);
                return page.adaptTo(ConfigurationBuilder.class).as(FormConfigurations.class);
        }

        private boolean isValidFileInEmailRequest(SlingHttpServletRequest request) {
                RequestParameter requestParameter = request.getRequestParameter(FILE_PARAM_NAME);
                if(requestParameter == null || StringUtils.isEmpty(requestParameter.getFileName())) {
                        return Boolean.TRUE;
                }
                String fileExtension = requestParameter.getFileName().substring(requestParameter.getFileName().lastIndexOf("."));
                int thresholdFileSizeInBytes = thresholdFileSize * ONE_MB_IN_BYTES;
                // if incoming file less than threshold and not in allowed file types then ignore the request
                if(requestParameter.getSize() > thresholdFileSizeInBytes || !allowedFileExtensions.contains(fileExtension)
                        || !allowedFileContentTypes.contains(requestParameter.getContentType())) {
                        LOG.error("Skipped form and email processing as attachment file size or extension/content-type is invalid!!");
                        LOG.error("Incoming file size {}, extension {} and content type {}.",
                                thresholdFileSizeInBytes, fileExtension, requestParameter.getContentType());
                        return Boolean.FALSE;
                }
                return Boolean.TRUE;
        }

        private Map<String, String[]> getPipeSplitMap(String[] sourceArray)
        {
                Map<String, String[]> itemsMap = new HashMap<>();
                for(String eachItem : sourceArray)
                {
                        String[] itemInfo = eachItem.split(Constants.PIPE_REGEX_ESCAPED);
                        if (itemInfo.length > 1)
                        {
                                itemsMap.put(itemInfo[0], itemInfo[1].split(Constants.COMMA));
                        }else{
                                LOG.error("Error when creating itemInfo for {}", eachItem);
                        }
                }
                return itemsMap;
        }

        private void prepareEmailRequestFromFormData(java.util.Map<String, org.apache.sling.api.request.RequestParameter[]> params,
                                                     Map<String, DataSource> attachments, Map<String, String> emailParams) throws CustomFormException {
                for (final java.util.Map.Entry<String, org.apache.sling.api.request.RequestParameter[]> pairs : params.entrySet()) {
                        final String key = pairs.getKey();
                        final org.apache.sling.api.request.RequestParameter[] pArr = pairs.getValue();
                        StringBuilder value = new StringBuilder();

                        if (key.contains(FILE_PARAM_NAME))
                        {
                                handleFileParameterProcessing(pArr, attachments, key, emailParams);
                        }else{
                                handleNonFileParameterProcessing(pArr, key, emailParams, value);
                        }

                }
        }

        private String[] addEmailToRecipients(String[] recipientList, String emailAddress) {
            String updatedEmailList[] = new String[recipientList.length + 1];
            for (int index = 0; index < recipientList.length; index++) {
                updatedEmailList[index] = recipientList[index];
            }
            updatedEmailList[updatedEmailList.length-1] = emailAddress;
            return updatedEmailList;
        }

        private void handleNonFileParameterProcessing(org.apache.sling.api.request.RequestParameter[] pArr,
                                                      String key, Map<String, String> emailParams,
                                                      StringBuilder value) throws CustomFormException {
                if (pArr.length > 0) {
                        for (RequestParameter rp : pArr) {
                                if (StringUtils.isNotEmpty(rp.toString())) {
                                        value.append(rp.toString());
                                }
                        }
                }
                LOG.debug("key is {}, value is {}", key, value);
                emailParams.put(key, validateString(value.toString()));
        }

        public String validateString(String input) throws CustomFormException {
                if(StringUtils.isEmpty(input)) return input;

                // validate for invalid characters
                if(StringUtils.isNotEmpty(blacklistCharsRegexExpr)) {
                        final Pattern pattern = Pattern.compile(blacklistCharsRegexExpr);
                        if (pattern.matcher(input).find()) {
                                throw new CustomFormException("Invalid form field, skipping the form and email submission.");
                        }
                }

                Set<String> keyset = charsEncodedMap.keySet();
                for (String key : keyset) {
                        input = input.replace(key, charsEncodedMap.get(key));
                }
                return input;
        }

        private void handleRequiredAttachments(SlingHttpServletRequest request, Map<String, String> emailParams, 
                Map<String, DataSource> attachments) throws CustomFormException {
            String groupKey = emailParams.get(Constants.FORM_GROUP_KEY_FIELD);

            if (groupKey != null)
            {
                try {

                    String[] attachmentPaths = requiredAttachmentPaths.get(groupKey);
                    if (attachmentPaths != null)
                    {
                        for(String path : attachmentPaths) {
                            InputStream file = getEmailAttachmentAsset(request, path);
                            if (file != null) {
                                attachments.put(getFileName(path), new ByteArrayDataSource(file, "application/pdf")); // TODO: Get this MIME type dynamically somehow
                            }
                        }
                    }else{
                            return;
                    }
                } catch (IOException e) {
                    throw new CustomFormException("Failed when processing the required attachments for " + groupKey);
                }
            }else{
                    LOG.error("Group Key Not found");
                    return;
            }
        }

        private void handleFileParameterProcessing(org.apache.sling.api.request.RequestParameter[] pArr, Map<String, DataSource> attachments, String key, Map<String, String> emailParams ) throws CustomFormException{
                try {
                        RequestParameter fileRequestParameter = pArr[0];
                        LOG.debug("file input parameter found. Name is {} ", fileRequestParameter.getFileName());
                        if (StringUtils.isNotEmpty(fileRequestParameter.getFileName()) && fileRequestParameter.getInputStream() != null) {
                                InputStream file = fileRequestParameter.getInputStream();
                                attachments.put(fileRequestParameter.getFileName(), new ByteArrayDataSource(file, fileRequestParameter.getContentType()));
                                emailParams.put(key, fileRequestParameter.getFileName());
                        } else {
                                LOG.error("Error in determining file uploaded");
                        }
                } catch (IOException e) {
                        throw new CustomFormException("Failed when processing the field = " + key);
                }
        }
        private void handleAttachmentsInEmail(FormConfigurations formConfigurations,Map<String, String> emailParams){
                for (int i=1;i<=formConfigurations.filesCount();i++){
                        if (emailParams.get("file")==null){
                               emailParams.put("file","");
                        } else if (emailParams.get("file"+i)==null){
                                emailParams.put("file"+i,"");
                        }
                }
        }
        private void populateEmailAttributesFromCAConfig(FormConfigurations formConfigurations, Map<String, String> emailParams) {
                toEmailAddresses = formConfigurations.toEmails();
                submitterEmailFieldName = formConfigurations.submitterEmailFieldName();
                if (formConfigurations.shouldSendCustomerSubmissionEmail()) {
                    toEmailAddresses = addEmailToRecipients(toEmailAddresses, emailParams.get(submitterEmailFieldName));
                }
                String confirmationEmailBody = formConfigurations.confirmationEmailBody();
                emailParams.put(CONFIRMATION_EMAIL_BODY_PARAM_NAME, confirmationEmailBody);
                internalEmailTemplatePath = formConfigurations.internalEmailTemplatePath();
                if(emailParams.get(":redirect")!= null && emailParams.get(":redirect").contains("apac")) {
                        confirmationEmailTemplatePath = formConfigurations.apacConfirmationEmailTemplatePath();
                }else {
                        confirmationEmailTemplatePath = formConfigurations.genericConfirmationEmailTemplatePath();
                }
                String confirmationHelpDesk = formConfigurations.confirmationHelpDesk();
                emailParams.put(CONFIRMATION_EMAIL_HELP_DESK, confirmationHelpDesk);
                String emailSubject = formConfigurations.emailSubject();
                emailParams.put(INTERNAL_EMAIL_SUBJECT_PARAM_NAME, emailSubject);
                String confirmationEmailSubject = formConfigurations.confirmationEmailSubject();
                formSubmissionTargetGroups = getPipeSplitMap(formConfigurations.formSubmissionTargetGroups());
                emailParams.put(CONFIRMATION_EMAIL_SUBJECT_PARAM_NAME, confirmationEmailSubject);
        }

        private void prepareEncodedChars(FormConfigurations formConfigurations) {
                String[] charsWithEncodedValues = formConfigurations.charsWithEncodedValues();
                for (String term : charsWithEncodedValues) {
                        String[] splitValues = term.split(ENCODE_DELIMITER);
                        if (splitValues.length == 2) {
                                charsEncodedMap.put(splitValues[0], splitValues[1]);
                        }
                }
        }

        private void sendEmailWithFormData(String[] toEmailAddresses, Map<String, String> emailParams, String submitterEmailFieldName,
                                           String internalEmailTemplatePath, String confirmationEmailTemplatePath, Map<String, DataSource> attachments) {
                String submitterEmailAddress = emailParams.get(submitterEmailFieldName);
                String[] internalEmailAddresses = getInternalEmailAddressArray(emailParams, toEmailAddresses, formSubmissionTargetGroups);
                if (!internalEmailTemplatePath.isEmpty()) {
                        if (attachments!=null && attachments.size() > 0) {
                                emailService.sendEmail(internalEmailTemplatePath, emailParams, attachments, internalEmailAddresses);
                        } else {
                                LOG.info("No attachments. Sending without attachments");
                                emailService.sendEmail(internalEmailTemplatePath, emailParams, internalEmailAddresses);
                        }
                } else {
                        LOG.error("Cannot send form email. Internal email template path is not set.");
                }

                if (!confirmationEmailTemplatePath.isEmpty() && submitterEmailAddress != null && !submitterEmailAddress.isEmpty()) {
                        String[] submitterEmailAddressArray = submitterEmailAddress.split(Constants.COMMA);
                        emailService.sendEmail(confirmationEmailTemplatePath, emailParams, submitterEmailAddressArray);
                } else {
                        LOG.error("Cannot send confirmation email. Confirmation email template path, or submitter email, or submitter email field name is incorrect, or is not set.");
                }
        }

        private String[] getInternalEmailAddressArray(Map<String, String> emailParams, String[] toEmailAddresses, Map<String, String[]> formSubmissionTargetGroups) {

                String groupKey = emailParams.get(Constants.FORM_GROUP_KEY_FIELD);

                if (groupKey != null)
                {
                        String[] internalAddressArray = formSubmissionTargetGroups.get(groupKey);
                        if (internalAddressArray != null)
                        {
                                return internalAddressArray;
                        }else{
                                return toEmailAddresses;
                        }
                }else{
                        LOG.error("Group Key Not found");
                        return toEmailAddresses;
                }

        }

        private InputStream getEmailAttachmentAsset(SlingHttpServletRequest request, String path) {
            Resource resource = request.getResourceResolver().getResource(path);
            ExtractBinaryAsset binaryAsset = resource != null ? resource.adaptTo(ExtractBinaryAsset.class) : null;
            return binaryAsset != null ? binaryAsset.getBinary() : null;
        }

        private String getFileName(String path) {
            String[] segments = path.split("/");
            
            return segments != null ? segments[segments.length-1] : StringUtils.EMPTY;            
        }
}

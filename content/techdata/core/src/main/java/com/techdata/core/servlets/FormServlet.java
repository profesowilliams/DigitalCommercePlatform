package com.techdata.core.servlets;


import com.adobe.acs.commons.email.EmailService;
import com.day.cq.wcm.api.Page;
import com.techdata.core.slingcaconfig.CommonConfigurations;
import com.techdata.core.slingcaconfig.ServiceEndPointsConfiguration;
import org.apache.commons.lang3.StringUtils;
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

@Component(
        immediate = true,
        service = Servlet.class,
        property = {
                "service.description=Form Submission Servlet",
                "service.vendor=techdata.com",
                "sling.servlet.methods=" + HttpConstants.METHOD_POST,
                "sling.servlet.paths=/bin/form"
        }
)
public class FormServlet extends SlingAllMethodsServlet {
        private static final Logger LOG = LoggerFactory.getLogger(FormServlet.class);
        @Reference
        private transient EmailService emailService;

        private String toEmailAddresses = StringUtils.EMPTY;
        private String submitterEmailFieldName = StringUtils.EMPTY;
        private String internalEmailTemplatePath = StringUtils.EMPTY;
        private String confirmationEmailTemplatePath = StringUtils.EMPTY;
        private int thresholdFileSize = 10;
        private List<String> allowedFileTypes = new ArrayList<>();

        private static final String CA_CONFIG_PATH = "/content/techdata";
        private static final String FILE_PARAM_NAME = "file";
        private static final int ONE_MB_IN_BYTES = 1000000;

        @Override
        protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
                PrintWriter out = response.getWriter();
                ResourceResolver resourceResolver = request.getResourceResolver();
                Resource resource = resourceResolver.getResource(CA_CONFIG_PATH);
                Page page = resource.adaptTo(Page.class);
                ServiceEndPointsConfiguration serviceEndPointsConfiguration =
                        page.adaptTo(ConfigurationBuilder.class).as(ServiceEndPointsConfiguration.class);
                out.print(serviceEndPointsConfiguration.downloadInvoiceEndpoint());
        }

        @Override
        protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
                Map<String, String> emailParams = new HashMap<>();
                ResourceResolver resourceResolver = request.getResourceResolver();
                Map<String, DataSource> attachments = new HashMap<>();
                try
                {
                        final boolean isMultipart = org.apache.commons.fileupload.servlet.ServletFileUpload.isMultipartContent(request);
                        LOG.debug("isMultipart {}", isMultipart);
                        if (isMultipart) {
                                prepareEmailRequestFromFormData(request.getRequestParameterMap(), attachments, emailParams);
                                Resource resource = resourceResolver.getResource(CA_CONFIG_PATH);
                                if(populateEmailAttributesFromCAConfig(resource, emailParams)) {
                                        if(isValidEmailRequest(request)) {
                                                sendEmailWithFormData(toEmailAddresses, emailParams, submitterEmailFieldName,
                                                        internalEmailTemplatePath, confirmationEmailTemplatePath, attachments);
                                        } else {
                                                LOG.error("Ignored:: Wrong form/email request with invalid upload file size or extension..");
                                        }
                                }
                        }
                }
                catch (Exception e) {
                        LOG.error("Exception occurred during form submission", e);
                }
        }

        private boolean isValidEmailRequest(SlingHttpServletRequest request) {
                RequestParameter requestParameter = request.getRequestParameter(FILE_PARAM_NAME);
                if(requestParameter == null) {
                        return Boolean.TRUE;
                }
                String fileExtension = requestParameter.getFileName().substring(requestParameter.getFileName().lastIndexOf("."));
                int thresholdFileSizeInBytes = thresholdFileSize * ONE_MB_IN_BYTES;
                // if incoming file less than threshold and not in allowed file types then ignore the request
                if(requestParameter.getSize() > thresholdFileSizeInBytes || !allowedFileTypes.contains(fileExtension)) {
                        LOG.error("Skipped form and email processing as attachment file size or extension is invalid!!");
                        LOG.error("Incoming file size {} and extension {}.", thresholdFileSizeInBytes, fileExtension);
                        return Boolean.FALSE;
                }
                return Boolean.TRUE;
        }

        private void prepareEmailRequestFromFormData(java.util.Map<String, org.apache.sling.api.request.RequestParameter[]> params,
                                                     Map<String, DataSource> attachments, Map<String, String> emailParams) throws IOException {
                for (final java.util.Map.Entry<String, org.apache.sling.api.request.RequestParameter[]> pairs : params.entrySet()) {
                        final String key = pairs.getKey();
                        LOG.debug("Key: {}. Key length is {}", key, key.length());
                        final org.apache.sling.api.request.RequestParameter[] pArr = pairs.getValue();
                        StringBuilder value = new StringBuilder();

                        if (key.equals(FILE_PARAM_NAME))
                        {
                                handleFileParameterProcessing(pArr, attachments);
                        }else{
                                handleNonFileParameterProcessing(pArr, key, emailParams, value);
                        }

                }
        }

        private void handleNonFileParameterProcessing(org.apache.sling.api.request.RequestParameter[] pArr,
                                                      String key, Map<String, String> emailParams,
                                                      StringBuilder value) {
                value.append(pArr[0].toString());
                if (pArr.length > 1)
                {
                        for (RequestParameter rp : pArr)
                        {
                                value.append(value.toString()).append(rp.toString()).append("|");
                        }
                }
                LOG.debug("after checking for file parameter");
                emailParams.put(key,value.toString());
                LOG.debug("value is {}",value);
        }

        private void handleFileParameterProcessing(org.apache.sling.api.request.RequestParameter[] pArr, Map<String, DataSource> attachments) throws IOException {
                LOG.debug("file input parameter found");
                RequestParameter fileRequestParameter = pArr[0];

                LOG.debug("file input parameter found. Name is {}, content type is {}", fileRequestParameter.getFileName(), fileRequestParameter.getContentType());
                if (fileRequestParameter.getContentType()!= null && fileRequestParameter.getFileName() != null && fileRequestParameter.getInputStream() != null)
                {
                        InputStream file = fileRequestParameter.getInputStream();
                        attachments.put(fileRequestParameter.getFileName(), new ByteArrayDataSource(file, fileRequestParameter.getContentType()));
                }else{
                        LOG.error("Error in determining file uploaded");
                }
        }

        private boolean populateEmailAttributesFromCAConfig(Resource resource, Map<String, String> emailParams) {
                boolean flag = Boolean.FALSE;
                if (resource != null) {
                        Page page = resource.adaptTo(Page.class);
                        CommonConfigurations commonConfigurations =
                                page.adaptTo(ConfigurationBuilder.class).as(CommonConfigurations.class);
                        toEmailAddresses = commonConfigurations.toEmails();
                        submitterEmailFieldName = commonConfigurations.submitterEmailFieldName();
                        String confirmationEmailBody = commonConfigurations.confirmationEmailBody();
                        emailParams.put("confirmationEmailBody", confirmationEmailBody);
                        internalEmailTemplatePath = commonConfigurations.internalEmailTemplatePath();
                        confirmationEmailTemplatePath = commonConfigurations.confirmationEmailTemplatePath();
                        String emailSubject = commonConfigurations.emailSubject();
                        emailParams.put("subject", emailSubject);
                        String confirmationEmailSubject = commonConfigurations.confirmationEmailSubject();
                        thresholdFileSize = commonConfigurations.fileThresholdInMB();
                        allowedFileTypes = Arrays.asList(commonConfigurations.allowedFileTypes().split(","));
                        emailParams.put("confirmationSubject", confirmationEmailSubject);
                        flag = Boolean.TRUE;
                } else {
                        LOG.error("resource to read CA config from, is null");
                }
                return flag;

        }

        private void sendEmailWithFormData(String toEmailAddresses, Map<String, String> emailParams, String submitterEmailFieldName,
                                           String internalEmailTemplatePath, String confirmationEmailTemplatePath, Map<String, DataSource> attachments) {
                String[] toEmailAddressesArray = toEmailAddresses.split(",");
                String submitterEmailAddress = emailParams.get(submitterEmailFieldName);

                if (!internalEmailTemplatePath.isEmpty()) {
                        if (attachments.size() > 0) {
                                emailService.sendEmail(internalEmailTemplatePath, emailParams, attachments, toEmailAddressesArray);
                        } else {
                                LOG.debug("No attachments. Sending without attachments");
                                emailService.sendEmail(internalEmailTemplatePath, emailParams, toEmailAddressesArray);
                        }
                } else {
                        LOG.error("internal email template path is not set.");
                }

                if (!confirmationEmailTemplatePath.isEmpty() && submitterEmailAddress != null && !submitterEmailAddress.isEmpty()) {
                        String[] submitterEmailAddressArray = submitterEmailAddress.split(",");
                        emailService.sendEmail(confirmationEmailTemplatePath, emailParams, submitterEmailAddressArray);
                } else {
                        LOG.error("confirmation email template path, or submitter email, or submitter email field name is incorrect, or is not set.");
                }
        }
}

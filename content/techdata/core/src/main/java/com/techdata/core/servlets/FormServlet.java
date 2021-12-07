package com.techdata.core.servlets;


import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.techdata.core.slingcaconfig.CommonConfigurations;
import com.techdata.core.slingcaconfig.ServiceEndPointsConfiguration;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.caconfig.ConfigurationBuilder;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.adobe.acs.commons.email.EmailService;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;

import com.day.cq.wcm.api.Page;

@Component(
        immediate = true,
        service = Servlet.class,
        property = {
                "service.description=JSXF Servlet",
                "service.vendor=techdata.com",
                "sling.servlet.paths=/bin/testtd"
        }
)
public class FormServlet extends SlingAllMethodsServlet {
        private static final Logger LOG = LoggerFactory.getLogger(FormServlet.class);
        @Reference
        EmailService emailService;

        private final static String CA_CONFIG_PATH = "/content/techdata";


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
                List<RequestParameter> l = request.getRequestParameterList();
                Map<String, String> emailParams = new HashMap<String, String>();

                BufferedReader bf = request.getReader();
                String strLine = "";
                String strJsonPayload = "";
                String configValues = "";
                String toEmailAddresses = "";
                ResourceResolver resourceResolver = request.getResourceResolver();
                String submitterEmailFieldName = "";
                String confirmationEmailBody = "";
                String internalEmailTemplatePath = "";
                String confirmationEmailTemplatePath = "";
                String emailSubject = "";
                String confirmationEmailSubject = "";

                Resource resource = resourceResolver.getResource(CA_CONFIG_PATH);

                if (resource!=null)
                {
                        Page page = resource.adaptTo(Page.class);
                        CommonConfigurations commonConfigurations =
                                page.adaptTo(ConfigurationBuilder.class).as(CommonConfigurations.class);
                        configValues = "Config value : " + commonConfigurations.emailSubject();
                        toEmailAddresses = commonConfigurations.toEmails();
                        submitterEmailFieldName = commonConfigurations.submitterEmailFieldName();
                        confirmationEmailBody = commonConfigurations.confirmationEmailBody();
                        emailParams.put("confirmationEmailBody", confirmationEmailBody);
                        internalEmailTemplatePath = commonConfigurations.internalEmailTemplatePath();
                        confirmationEmailTemplatePath = commonConfigurations.confirmationEmailTemplatePath();
                        emailSubject = commonConfigurations.emailSubject();
                        emailParams.put("subject", emailSubject);
                        confirmationEmailSubject = commonConfigurations.confirmationEmailSubject();
                        emailParams.put("confirmationSubject", confirmationEmailSubject);

                }else {
                        LOG.error("resource to read CA config from, is null");
                }

                String[] toEmailAddressesArray = toEmailAddresses.split(",");

                while ((strLine = bf.readLine()) != null) {
                        strJsonPayload = strJsonPayload + strLine;
                }

                JsonObject jsonObject = new JsonParser().parse(strJsonPayload).getAsJsonObject();
                Iterator<String> it  =  jsonObject.keySet().iterator();
                while( it.hasNext() ) {

                        String key = it.next();
                        Object value = jsonObject.get(key);
                        String strValue = value.toString().replace("\"","");
                        emailParams.put(key, strValue);
                }

                String submitterEmailAddress = emailParams.get(submitterEmailFieldName);

                if (!internalEmailTemplatePath.isEmpty())
                {
                        LOG.info("Submitting internal email to {}", Arrays.toString(toEmailAddressesArray));
                        emailService.sendEmail(internalEmailTemplatePath, emailParams, toEmailAddressesArray);
                }else{
                        LOG.error("internal email template path is not set.");
                }

                if (!confirmationEmailTemplatePath.isEmpty() && submitterEmailAddress != null && !submitterEmailAddress.isEmpty())
                {
                        String[] submitterEmailAddressArray = submitterEmailAddress.split(",");
                        LOG.info("Submitting confirmation email to {}",Arrays.toString(submitterEmailAddressArray));
                        emailService.sendEmail(confirmationEmailTemplatePath, emailParams, submitterEmailAddressArray);
                }else{
                        LOG.error("confirmation email template path, or submitter email, or submitter email field name is incorrect, or is not set.");
                }

        }
}

package com.techdata.core.servlets;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component(
        service = Servlet.class,
        property = {
                "name=" + "Create Config Postback Servlet",
                "service.description=" + "Servlet to Receive Post Request From Cisco for Configuration Creation.",
                "sling.servlet.methods=" + "POST",
                "sling.servlet.resourceTypes=" + "techdata/components/createconfig",
                "sling.servlet.selectors=" + "post2get",
                "sling.servlet.extensions=" + "html"
        }
)
public class CreateConfigPostBackServlet extends SlingAllMethodsServlet {

    private static Logger LOGGER = LoggerFactory.getLogger(CreateConfigPostBackServlet.class);

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response)
            throws ServletException, IOException {

        String quotePreviewUrl = "/content/techdata/americas/us/en/dcp/quotes/quote-preview.html";
        ValueMap createConfigProperties = request.getResource().getValueMap();

        // If property is not set at component's dialog level, it'll take the value set on line 39 by default.
        if (createConfigProperties.containsKey("quotePreviewUrl") && createConfigProperties.containsKey("quotePreviewUrlSuffix")) {
            quotePreviewUrl = createConfigProperties.get("quotePreviewUrl", String.class) +
                    createConfigProperties.get("quotePreviewUrlSuffix", String.class);
        }

        LOGGER.debug("*** Quote Preview URL {}", quotePreviewUrl);

        String cxmlUrlEncoded = request.getParameter("cxml-urlencoded");

        List<String> dealOrEstimate = findDealOrEstimateId(cxmlUrlEncoded);

        if (!dealOrEstimate.isEmpty()) {
            quotePreviewUrl = quotePreviewUrl
                    .replaceAll("\\{id}", dealOrEstimate.get(1))
                    .replaceAll("\\{type}", dealOrEstimate.get(0));
            LOGGER.debug("*** Redirecting to {}", quotePreviewUrl);
            response.sendRedirect(quotePreviewUrl);
        }
    }

    private List<String> findDealOrEstimateId(String cxmlUrlEncoded) {
        List<String> dealOrEstimate = new ArrayList<>();
        Pattern pattern = Pattern.compile("<Extrinsic name=\"(EstimateID|DealID)\">([a-zA-Z0-9]+)</Extrinsic>");
        Matcher matcher = pattern.matcher(cxmlUrlEncoded);
        boolean matchFound = matcher.find();
        if (matchFound) {
            // EstimateID or DealID String names
            dealOrEstimate.add(StringEscapeUtils.escapeJavaScript(matcher.group(1).replaceAll("ID$", "")));
            //ID found in XML
            dealOrEstimate.add(StringEscapeUtils.escapeJavaScript(matcher.group(2)));
        }
        return dealOrEstimate;
    }
}

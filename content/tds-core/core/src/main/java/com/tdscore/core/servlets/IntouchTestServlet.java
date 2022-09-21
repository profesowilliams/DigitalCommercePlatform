package com.tdscore.core.servlets;

import com.tdscore.core.services.IntouchRequest;
import com.tdscore.core.services.IntouchRequestType;
import com.tdscore.core.services.IntouchRetrieveDataService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;

@Component(service = Servlet.class,
        property = { "sling.servlet.paths=/bin/intouch/getdata",
                "sling.servlet.methods=" + HttpConstants.METHOD_GET})
public class IntouchTestServlet extends SlingSafeMethodsServlet {

    @Reference
    private IntouchRetrieveDataService intouchRetrieveDataService;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        String apiUrl = "https://eastus-dit-ui.dc.tdebusiness.cloud/ui-intouch/v1/CSS";
        int type = IntouchRequestType.CSS_REQUEST.getId();
        String requestType = request.getRequestParameter("type").getString();
        if(requestType.equalsIgnoreCase("JS")) {
            apiUrl = "https://eastus-dit-ui.dc.tdebusiness.cloud/ui-intouch/v1/JS";
            type = IntouchRequestType.JS_REQUEST.getId();
        }

        IntouchRequest intouchRequest = new IntouchRequest(type, apiUrl, "UK", "en-US");
        String data = intouchRetrieveDataService.fetchScriptsData(intouchRequest);
        LOGGER.info("Data returned {} ", data);
    }

    private static final Logger LOGGER = LoggerFactory.getLogger(IntouchTestServlet.class);

}

package com.tdscore.core.servlets;

import com.day.cq.wcm.api.Page;
import com.tdscore.core.services.ReactFormTranslationService;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.servlet.Servlet;
import java.io.IOException;

@Component(
        immediate = true,
        service = Servlet.class,
        property = {
                "service.description=React Translation Form Servlet",
                "service.vendor=tdsynnex.com",
                "sling.servlet.methods=" + HttpConstants.METHOD_GET,
                "sling.servlet.paths=/bin/translate/form"
        }
)
public class ReactFormTranslationServlet  extends SlingAllMethodsServlet {

    @Reference
    private ReactFormTranslationService translationService;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String site = fetchParameterValue(request, "site", "tds-site");
        String region = fetchParameterValue(request, "region", "americas");
        String country = fetchParameterValue(request, "country", "us");
        String language = fetchParameterValue(request, "language", "en");

        String formJsonPath = request.getParameter("formJsonPath");
        if (StringUtils.isEmpty(formJsonPath)) {
            return;
        }
        Resource damResource = request.getResourceResolver().getResource(formJsonPath);
        if(damResource != null) {
            String path = "/content/" + site + "/" + region + "/" + country + "/" + language;
            Resource pageResource = request.getResourceResolver().getResource(path);
            if(pageResource != null) {
                Page localePage = pageResource.adaptTo(Page.class);
                String jsonResponse = translationService.prepareTranslatedForm(damResource, localePage, request);
                response.getWriter().print(jsonResponse);
            }
        }
        response.getWriter().print("{}");
    }

    private String fetchParameterValue(SlingHttpServletRequest request, String headerName, String defaultValue) {
        String value = request.getParameter(headerName);
        if (StringUtils.isEmpty(value)) {
            value = defaultValue;
        }
        return value;
    }

}

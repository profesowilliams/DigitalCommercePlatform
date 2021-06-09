package com.techdata.core.servlets;

import com.adobe.granite.ui.clientlibs.ClientLibrary;
import com.adobe.granite.ui.clientlibs.HtmlLibraryManager;
import com.adobe.granite.ui.clientlibs.LibraryType;
import com.day.cq.commons.Externalizer;
import com.day.cq.contentsync.handler.util.RequestResponseFactory;
import com.day.cq.wcm.api.WCMMode;
import com.google.common.net.HttpHeaders;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import org.apache.http.entity.ContentType;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.engine.SlingRequestProcessor;
import org.apache.sling.settings.SlingSettingsService;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Base64;
import java.util.Collection;


@Component(
        immediate = true,
        service = Servlet.class,
        property = {
                "service.description=JSXF Servlet",
                "service.vendor=techdata.com",
                "sling.servlet.resourcetypes=techdata/components/xfpage",
                "sling.servlet.extensions=js"
        }
)
@Designate(ocd = ExperienceFragmentJSServlet.XFJSServletConfig.class)
public class ExperienceFragmentJSServlet extends SlingSafeMethodsServlet {

    private String htmlClientLibCategoriesJQuery = "/etc.clientlibs/clientlibs/granite/jquery.js";
    private String[] htmlClientLibCategories = null;

    @ObjectClassDefinition(name = "Techdata XF JS Servlet")
    public @interface XFJSServletConfig {
        @AttributeDefinition(name = "JQuery Library")
        String jquery_path() default JQUERY_DEFAULT;
        @AttributeDefinition(name = "ClientLib Categories")
        String[] clientlib_categories() default {"techdata.base", "techdata.dependencies", "techdata.site"};

    }

    @Reference
    private RequestResponseFactory requestResponseFactory;

    @Reference
    private SlingRequestProcessor requestProcessor;

    @Reference
    private HtmlLibraryManager htmlLibraryManager;

    @Reference
    private Externalizer externalizer;

    @Reference
    private SlingSettingsService settingsService;

    private boolean isPublish = false;

    @Activate
    protected void activate(XFJSServletConfig config) {
        if(settingsService.getRunModes().contains(Externalizer.PUBLISH)) {
            this.isPublish = true;
        }
        this.htmlClientLibCategoriesJQuery = config.jquery_path();
        this.htmlClientLibCategories = config.clientlib_categories();

    }

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        LOG.debug("Do get for XFJSServlet...");
        PrintWriter out = response.getWriter();

        response.setContentType(ContentType.APPLICATION_JSON.getMimeType());
        response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN,  "*");

        JsonObject xfJson = new JsonObject();
        LOG.debug("JsonObject created...");
        xfJson.addProperty("reqJquery", getMainLibraries(request, LibraryType.JS, new String[]{htmlClientLibCategoriesJQuery}).getAsString());

        // get page clientlibs
        xfJson.add("cssLibs", getMainLibraries(request, LibraryType.CSS, htmlClientLibCategories));
        xfJson.add("jsLibs", getMainLibraries(request, LibraryType.JS, htmlClientLibCategories));

        LOG.debug("Added clientlibs...");

        // get html
        String contentHtml = getPageContentHtml(request);
        contentHtml = contentHtml.replace("\"/content", String.format("\"%1$s", getLink(request, "/content")));
        String formattedString = new String(Base64.getEncoder().encode(contentHtml.getBytes()));
        xfJson.addProperty("content", formattedString);

        out.print(xfJson);

        LOG.debug("Exit XFJSServlet...");

    }

    private JsonElement getMainLibraries(SlingHttpServletRequest request, LibraryType libraryType, String[] categories) {
        JsonArray clientLibs = new JsonArray();
        Collection<ClientLibrary> libraries = htmlLibraryManager.getLibraries(categories, libraryType, Boolean.TRUE, Boolean.TRUE);
        for (ClientLibrary library : libraries) {
            clientLibs.add(new JsonPrimitive(getLink(request, sanitizeClientLibraryPath(library.getPath() + libraryType.extension))));
        }


        return clientLibs;
    }

    private String sanitizeClientLibraryPath(String clientLibraryPath) {
        if (clientLibraryPath.startsWith(APPS) || clientLibraryPath.startsWith(LIBS))
        {
            return clientLibraryPath.replace(APPS, ETC_CLIENTLIBS).replace(LIBS, ETC_CLIENTLIBS);
        }

        return clientLibraryPath;
    }

    private String getPageContentHtml(SlingHttpServletRequest request) throws ServletException, IOException {
        Resource xfResource = request.getResource();

        String resourcePath = xfResource.getPath() + ".noclientlibs.atoffer.html";
        HttpServletRequest req = requestResponseFactory.createRequest(HttpConstants.METHOD_GET, resourcePath);

        WCMMode.DISABLED.toRequest(req);

        ByteArrayOutputStream reqOut = new ByteArrayOutputStream();
        HttpServletResponse resp = requestResponseFactory.createResponse(reqOut);

        requestProcessor.processRequest(req, resp, request.getResourceResolver());

        return reqOut.toString();
    }

    private String getLink(SlingHttpServletRequest request, String relativePath) {
        ResourceResolver resourceResolver = request.getResourceResolver();
        LOG.debug("Relative path is {}", relativePath);
        return isPublish() ? externalizer.publishLink(resourceResolver, resourceResolver.map(relativePath)) :
                externalizer.authorLink(resourceResolver, relativePath);
    }

    public boolean isPublish() {
        return isPublish;
    }

    private static final String JQUERY_DEFAULT = "jquery";
    private static final String APPS = "/apps/";
    private static final String LIBS = "/libs/";
    private static final String ETC_CLIENTLIBS = "/etc.clientlibs/";
    private static final Logger LOG = LoggerFactory.getLogger(ExperienceFragmentJSServlet.class);

}


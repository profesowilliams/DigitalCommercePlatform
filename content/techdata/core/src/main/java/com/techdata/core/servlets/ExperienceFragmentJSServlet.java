package com.techdata.core.servlets;
import com.adobe.granite.ui.clientlibs.ClientLibrary;
import com.adobe.granite.ui.clientlibs.HtmlLibrary;
import com.adobe.granite.ui.clientlibs.HtmlLibraryManager;
import com.adobe.granite.ui.clientlibs.LibraryType;
import com.day.cq.commons.Externalizer;
import com.day.cq.contentsync.handler.util.RequestResponseFactory;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.WCMMode;
import com.day.cq.wcm.api.designer.Design;
import com.day.cq.wcm.api.designer.Designer;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;

import org.apache.commons.io.IOUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.commons.osgi.PropertiesUtil;
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
import java.io.StringWriter;
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

        private static final Logger LOG = LoggerFactory.getLogger(ExperienceFragmentJSServlet.class);

        private String htmlClientLibCategoriesJQuery = "/etc.clientlibs/clientlibs/granite/jquery.js";
        private String[] htmlClientLibCategories = null;

        @ObjectClassDefinition(name = "Techdata XF JS Servlet")
        public @interface XFJSServletConfig {
            @AttributeDefinition(name = "JQuery Library")
            String jquery_path() default "jquery";
            @AttributeDefinition(name = "ClientLib Categories")
            String[] clientlib_categories() default {"techdata.base",
                    "techdata.dependencies",
                    "techdata.site"};

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
            this.htmlClientLibCategoriesJQuery = (String.valueOf(config.jquery_path()) != null) ? String.valueOf(config.jquery_path())
                    : "jquery";
            this.htmlClientLibCategories = (PropertiesUtil.toStringArray(config.clientlib_categories()) != null) ? PropertiesUtil.toStringArray(config.clientlib_categories())
                    : null;

        }

        @Override
        protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
            LOG.debug("Do get for XFJSServlet...");
            PrintWriter out = response.getWriter();

            response.setContentType("application/javascript");
            response.setHeader("Access-Control-Allow-Origin",  "*");

            JsonObject xfJson = new JsonObject();
            LOG.debug("JsonObject created...");
            xfJson.addProperty("reqJquery", getMainLibraries(request, LibraryType.JS, new String[]{htmlClientLibCategoriesJQuery}).getAsString());

            // get page clientlibs
            xfJson.add("cssLibs", getMainLibraries(request, LibraryType.CSS, htmlClientLibCategories));
            xfJson.add("jsLibs", getMainLibraries(request, LibraryType.JS, htmlClientLibCategories));

            LOG.debug("Added clientlibs...");

            LOG.debug("getPageClientLibsContent requested...");
//            getPageClientLibsContent(request);

            // get html
            String contentHtml = getPageContentHtml(request);
            contentHtml = contentHtml.replace("\"/content", String.format("\"%1$s", getLink(request, "/content")));
            String formattedString = new String(Base64.getEncoder().encode(contentHtml.getBytes()));
            xfJson.addProperty("content", formattedString);

            LOG.debug("Getting deliveryJS...");
            out.print("var xfDeliveryObj = " + xfJson + ";");
//            out.print(getXfDeliveryJs());

            LOG.debug("Exit XFJSServlet...");

        }

        private JsonElement getMainLibraries(SlingHttpServletRequest request, LibraryType libraryType, String[] categories) {
            JsonArray clientLibs = new JsonArray();
            Collection<ClientLibrary> libraries = htmlLibraryManager.getLibraries(categories, libraryType, true, true);
            for (ClientLibrary library : libraries) {
                clientLibs.add(new JsonPrimitive(getLink(request, sanitizeClientLibraryPath(library.getPath() + libraryType.extension))));
            }


            return clientLibs;
        }

        private String sanitizeClientLibraryPath(String clientLibraryPath) {
            if (clientLibraryPath.startsWith("/apps") || clientLibraryPath.startsWith("/libs"))
            {
                return clientLibraryPath.replace("/apps/","/etc.clientlibs/").replace("/libs/","/etc.clientlibs/");
            }

            return clientLibraryPath;
        }


        private String getPageContentHtml(SlingHttpServletRequest request) throws ServletException, IOException {
            Resource xfResource = request.getResource();

            String resourcePath = xfResource.getPath() + ".html";
            HttpServletRequest req = requestResponseFactory.createRequest("GET", resourcePath);

            WCMMode.DISABLED.toRequest(req);

            ByteArrayOutputStream reqOut = new ByteArrayOutputStream();
            HttpServletResponse resp = requestResponseFactory.createResponse(reqOut);

            requestProcessor.processRequest(req, resp, request.getResourceResolver());

            return reqOut.toString();
        }

        private String getXfDeliveryJs() {
            Collection<ClientLibrary> libraries = htmlLibraryManager.getLibraries(new String[]{"site.xf-js"}, LibraryType.JS, true, true);
            StringWriter jsContentString = new StringWriter();

            LOG.info("Enter getXfDeliveryJs...");

            for (ClientLibrary library : libraries) {
                LOG.info("library..." + library.getPath());
                LOG.info("setting htmlLib..." + "http://localhost:4503/apps/canary-two/clientlibs/xf/index.js");
                HtmlLibrary htmlLib = htmlLibraryManager.getLibrary(LibraryType.JS, library.getPath());
                LOG.info("htmlLib library path..." + htmlLib.getLibraryPath());
                LOG.info("htmlLib..." + htmlLib.getName());
                try {
                    IOUtils.copy(htmlLib.getInputStream(), jsContentString, "UTF-8");
                } catch (IOException e) {
                }
            }

            LOG.info("Exit getXfDeliveryJs...");

            return jsContentString.toString();
        }

        private String getLink(SlingHttpServletRequest request, String relativePath) {
            ResourceResolver resourceResolver = request.getResourceResolver();
            String mappedPath = resourceResolver.map(request, relativePath);
            LOG.debug("relative path is + " + relativePath);
            System.out.println(mappedPath);
            return isPublish() ? externalizer.publishLink(resourceResolver, resourceResolver.map(relativePath)) :
                    externalizer.authorLink(resourceResolver, relativePath);
        }

        public boolean isPublish() {
            return isPublish;
        }
    }


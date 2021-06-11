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
import org.apache.commons.lang.StringUtils;
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
        xfJson.add("shopJson", buildShopJSON());

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

    private JsonArray buildShopJSON() {

        JsonArray shopJSONList = new JsonArray();


        shopJSONList.add(combinedMenuItemsJson());

        shopJSONList.add(createAccountSettingsJsonObject());
        shopJSONList.add(createShopOptionsJSONObject());
        shopJSONList.add(createAuthJSONObject());
        return shopJSONList;
    }

    private JsonObject combinedMenuItemsJson() {
        JsonObject menuItemsJson = new JsonObject();
        JsonArray jsonArray = new JsonArray();
        jsonArray.add(createMenuItemsJson());
        jsonArray.add(createMenuItemsJson2());
        menuItemsJson.add("shopHeader-menuItemsJson", jsonArray);
        return menuItemsJson;
    }

    private JsonObject createMenuItemsJson() {

        JsonObject menuItemsJsonData2 = new JsonObject();

        JsonArray jsonElementsMenuItems2 = new JsonArray();

        JsonObject careersData = new JsonObject();
        careersData.add("children", new JsonArray());
        careersData.addProperty("text", "Careers");
        careersData.addProperty("id", "Careers");
        careersData.addProperty("url", "https://qa5.ctenet.com/careers.html");
        careersData.addProperty("thisWindow", true);
        careersData.addProperty("highlight", false);
        careersData.addProperty("auth", false);
        jsonElementsMenuItems2.add(careersData);

        JsonObject newsRoomData = new JsonObject();
        newsRoomData.add("children", new JsonArray());
        newsRoomData.addProperty("text", "Company Overview");
        newsRoomData.addProperty("id", "company-overview");
        newsRoomData.addProperty("url", "https,//qa5.ctenet.com/about.html");
        newsRoomData.addProperty("thisWindow", true);
        newsRoomData.addProperty("highlight", false);
        newsRoomData.addProperty("auth", false);
        jsonElementsMenuItems2.add(newsRoomData);

        JsonObject companyOverview = new JsonObject();
        companyOverview.add("children", new JsonArray());
        companyOverview.addProperty("text", "News Room");
        companyOverview.addProperty("id", "news-room");
        companyOverview.addProperty("url", "https,//qa5.ctenet.com/news.html");
        companyOverview.addProperty("thisWindow", true);
        companyOverview.addProperty("highlight", false);
        companyOverview.addProperty("auth", false);
        jsonElementsMenuItems2.add(companyOverview);

        menuItemsJsonData2.add("children", jsonElementsMenuItems2);

        menuItemsJsonData2.addProperty("text", "About");
        menuItemsJsonData2.addProperty("id", "about");
        menuItemsJsonData2.addProperty("url", "https://qa5.ctenet.com/about.html");
        menuItemsJsonData2.addProperty("thisWindow", false);
        menuItemsJsonData2.addProperty("highlight", false);
        menuItemsJsonData2.addProperty("auth", false );

        return menuItemsJsonData2;

    }

    private JsonObject createMenuItemsJson2() {
        JsonObject menuItemsJsonData = new JsonObject();
        menuItemsJsonData.add("children", new JsonArray());
        menuItemsJsonData.addProperty("text", "Dashboard");
        menuItemsJsonData.addProperty("id", "dashboard");
        menuItemsJsonData.addProperty("url", "https,//shop.cstenet.com/");
        menuItemsJsonData.addProperty("thisWindow", true);
        menuItemsJsonData.addProperty("highlight", false);
        menuItemsJsonData.addProperty("auth", false );

        return menuItemsJsonData;

    }
    private JsonObject createAccountSettingsJsonObject() {
        JsonObject accountSettingsJson = new JsonObject();
        JsonObject accountSettingsJsonData = new JsonObject();
        accountSettingsJsonData.addProperty("userId","Anonymous");
        accountSettingsJsonData.addProperty("orderLevel",0);
        accountSettingsJsonData.addProperty("currentCartOrderLevel",0);
        accountSettingsJsonData.addProperty("market",1);
        accountSettingsJsonData.addProperty("searchSort",0);
        accountSettingsJsonData.addProperty("searchSortOrder",0);
        accountSettingsJsonData.addProperty("defaultPlant","A041");
        accountSettingsJsonData.addProperty("defaultShipToId","");
        accountSettingsJsonData.addProperty("searchNew",true);
        accountSettingsJsonData.addProperty("searchActive",true);
        accountSettingsJsonData.addProperty("searchAllocated",true);
        accountSettingsJsonData.addProperty("searchPhasedOut",true);
        accountSettingsJsonData.addProperty("searchInStock",false);
        accountSettingsJsonData.addProperty("searchReqAuth",false);
        accountSettingsJsonData.addProperty("colorScheme","light");
        accountSettingsJsonData.addProperty("customQuoteField1",StringUtils.EMPTY);
        accountSettingsJsonData.addProperty("customQuoteField2",StringUtils.EMPTY);
        accountSettingsJsonData.addProperty("blindPackaging",false);
        accountSettingsJsonData.addProperty("shipComplete",false);
        accountSettingsJsonData.addProperty("displayPlantLevelAvailability",false);
        accountSettingsJsonData.addProperty("orderConfirmation",true);
        accountSettingsJsonData.addProperty("orderCancelled",false);
        accountSettingsJsonData.addProperty("shipmentConfirmation",true);
        accountSettingsJsonData.addProperty("backorderChanges",false);
        accountSettingsJsonData.addProperty("salesReview",false);
        accountSettingsJsonData.addProperty("newEstShipDateChanges",false);
        accountSettingsJsonData.addProperty("creditReview",false);
        accountSettingsJsonData.addProperty("isMinimalProductSearchResults",false);
        accountSettingsJsonData.addProperty("marketTerritoryCode","");
        accountSettingsJsonData.addProperty("customerNumber","");
        accountSettingsJsonData.addProperty("productSearchItemsPerPage",25);
        accountSettingsJson.add("shopHeader-accountSettingsJson", accountSettingsJsonData);
        return accountSettingsJson;
    }

    private JsonObject createShopOptionsJSONObject() {
        JsonObject shopOptionsJson = new JsonObject();
        JsonObject shopOptionsJsonData = new JsonObject();
        shopOptionsJsonData.addProperty("shopUrl"," http,//localhost,63018");
        shopOptionsJsonData.addProperty("corporateUrl","http,//exwb11preview.dev.web.us.tdworldwide.com");
        shopOptionsJsonData.addProperty("legacyUrl","http,//exwb11preview.dev.web.us.tdworldwide.com");
        shopOptionsJsonData.addProperty("typeAheadUrl","https,//typeahead.dev.web.us.tdworldwide.com");
        shopOptionsJsonData.addProperty("shopDomain","shop.dev.web.us.tdworldwide.com");
        shopOptionsJsonData.addProperty("corporateDomain","exwb11preview.dev.web.us.tdworldwide.com/");
        shopOptionsJsonData.addProperty("legacyDomain","exwb11preview.dev.web.us.tdworldwide.com");
        shopOptionsJsonData.addProperty("cookieDomain",".us.tdworldwide.com");
        shopOptionsJsonData.addProperty("addManufacturerStoresToId","research");
        shopOptionsJsonData.addProperty("techSelectContentUrl","https,//shop.techdata.com/siteredirect/?referrer=shop.techdata.com&destination=http,//content.techselect.techdata.com&authPage=login.aspx&landingPage=http,//content.techselect.techdata.com");
        shopOptionsJsonData.addProperty("myOrderTrackerUrl","https,//shop.dev.web.us.tdworldwide.com/siteredirect/?referrer=shop.dev.web.us.tdworldwide.com&destination=http,//www.myordertracker.com&authPage=/us/default.aspx&landingPage=http,//www.myordertracker.com/reseller/MyOrderTracker.aspx");
        shopOptionsJsonData.addProperty("debug","true");
        shopOptionsJsonData.addProperty("clickstreamEnabled","true");
        shopOptionsJsonData.addProperty("enableTrackingEvents","true");
        shopOptionsJsonData.addProperty("enableAttributedTrackingEvents","true");
        shopOptionsJsonData.addProperty("debugTrackingEvents","true");
        shopOptionsJsonData.addProperty("adButlerEnabled","true");
        shopOptionsJsonData.addProperty("typeAheadEnabled","true");
        shopOptionsJsonData.addProperty("uberSearchEnabled","false");
        shopOptionsJsonData.addProperty("clickstreamEnabled","true");
        shopOptionsJsonData.addProperty("cNETInlineContentEnabled","true");
        shopOptionsJsonData.addProperty("webTrendsEnabled","true");
        shopOptionsJsonData.addProperty("productCategoriesMegaMenu","false");
        shopOptionsJson.add("shopHeader-shopOptionsJson", shopOptionsJsonData);
        return shopOptionsJson;
    }
    private JsonObject createAuthJSONObject() {
        JsonObject authenticationStatusJson = new JsonObject();

        JsonObject authenticationStatusJsonData = new JsonObject();
        authenticationStatusJsonData.addProperty("userId", StringUtils.EMPTY);
        authenticationStatusJsonData.addProperty("password", StringUtils.EMPTY);
        authenticationStatusJsonData.addProperty("accountNumber", StringUtils.EMPTY);
        authenticationStatusJsonData.addProperty("customerName", StringUtils.EMPTY);
        authenticationStatusJsonData.addProperty("success", Boolean.FALSE);
        authenticationStatusJsonData.addProperty("redirectLink", StringUtils.EMPTY);
        authenticationStatusJsonData.addProperty("message", StringUtils.EMPTY);
        authenticationStatusJsonData.addProperty("customerViewAvailable", Boolean.FALSE);
        authenticationStatusJsonData.addProperty("daysUntilPasswordExpiration", StringUtils.EMPTY);
        authenticationStatusJsonData.addProperty("passwordExpired", Boolean.FALSE);
        authenticationStatusJsonData.addProperty("token", StringUtils.EMPTY);
        authenticationStatusJsonData.addProperty("customerGroup", StringUtils.EMPTY);
        authenticationStatusJson.add("shopHeader-authenticationStatusJson", authenticationStatusJsonData);
        return authenticationStatusJson;
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
    // Sample JSON data for navigation
    private static final String MENU_HEADER_JSON_VALUE_DEFAULT =
            "[{\"children\": [],\"text\": \"dashboard\",\"id\": \"dashboard\",\"url\": \"https://shop.cstenet.com/\",\"thisWindow\": true,\"highlight\": false,\"auth\": false }, {\"children\": [{\"children\": [{\"children\": [{\"children\": [{\"children\": [],\"text\": \"Desktops\",\"id\": \"pc-3\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510010101&amp;refinements=510010101\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [],\"text\": \"Workstations\",\"id\": \"pc-4\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510010102&amp;refinements=510010102\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [],\"text\": \"Barebone Systems\",\"id\": \"pc-5\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510010103&amp;refinements=510010103\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [],\"text\": \"Thin Clients\",\"id\": \"pc-6\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510010104&amp;refinements=510010104\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}],\"text\": \"Desktops & Workstations\",\"id\": \"pc-2\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=500100101&amp;refinements=500100101\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [{\"children\": [],\"text\": \"Notebooks\",\"id\": \"pc-8\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510010201&amp;refinements=510010201\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [],\"text\": \"Ultrabooks\",\"id\": \"pc-9\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510010202&amp;refinements=510010202\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [],\"text\": \"Mobile Workstations\",\"id\": \"pc-10\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510010205&amp;refinements=510010205\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [],\"text\": \"Thin Client Notebooks\",\"id\": \"pc-11\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510010209&amp;refinements=510010209\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [],\"text\": \"Notebook Docking Stations\",\"id\": \"pc-12\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510010210&amp;refinements=510010210\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [],\"text\": \"Notebook Carrying Cases\",\"id\": \"pc-13\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510010211&amp;refinements=510010211\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [],\"text\": \"Notebook & Tablet Accessories\",\"id\": \"pc-14\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510010215&amp;refinements=510010215\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [],\"text\": \"Chromebooks\",\"id\": \"pc-15\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510010216&amp;refinements=510010216\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}],\"text\": \"Notebooks & Accessories\",\"id\": \"pc-7\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=500100102&amp;refinements=500100102\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [{\"children\": [],\"text\": \"Tablets & Handhelds\",\"id\": \"pc-17\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510010301&amp;refinements=510010301\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}],\"text\": \"Tablets & eBook readers\",\"id\": \"pc-16\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=500100103&amp;refinements=500100103\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [{\"children\": [],\"text\": \"Tower\",\"id\": \"pc-19\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510010401&amp;refinements=510010401\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [],\"text\": \"Rack\",\"id\": \"pc-20\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510010402&amp;refinements=510010402\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [],\"text\": \"Blade\",\"id\": \"pc-21\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510010403&amp;refinements=510010403\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [],\"text\": \"Traffic Balancers & Optimizers\",\"id\": \"pc-22\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510010407&amp;refinements=510010407\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}],\"text\": \"Servers\",\"id\": \"pc-18\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=500100104&amp;refinements=500100104\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [{\"children\": [],\"text\": \"POS Monitors\",\"id\": \"pc-24\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510010503&amp;refinements=510010503\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [],\"text\": \"Cash Drawers\",\"id\": \"pc-25\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510010505&amp;refinements=510010505\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}],\"text\": \"Point Of Sale Equipment\",\"id\": \"pc-23\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=500100105&amp;refinements=500100105\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}],\"text\": \"Systems\",\"id\": \"pc-1\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=500001001&amp;refinements=500001001\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [{\"children\": [{\"children\": [],\"text\": \"Computer\",\"id\": \"pc-28\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510020101&amp;refinements=510020101\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [],\"text\": \"Accessories\",\"id\": \"pc-29\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510020106&amp;refinements=510020106\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}],\"text\": \"Monitors\",\"id\": \"pc-27\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=500100201&amp;refinements=500100201\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [{\"children\": [],\"text\": \"DLP\",\"id\": \"pc-31\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510020301&amp;refinements=510020301\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [],\"text\": \"LCD\",\"id\": \"pc-32\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510020302&amp;refinements=510020302\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [],\"text\": \"Cables\",\"id\": \"pc-33\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510020307&amp;refinements=510020307\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [],\"text\": \"Accessories\",\"id\": \"pc-34\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510020309&amp;refinements=510020309\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [],\"text\": \"Lamps\",\"id\": \"pc-35\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=510020311&amp;refinements=510020311\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}],\"text\": \"Projectors\",\"id\": \"pc-30\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=500100203&amp;refinements=500100203\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}],\"text\": \"Displays & Projectors\",\"id\": \"pc-26\",\"url\": \"https://shop.cstenet.com/products/category/category?cs=500001002&amp;refinements=500001002\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}],\"text\": \"Product Categories\",\"id\": \"product-categories\",\"thisWindow\": false,\"highlight\": false,\"auth\": false}],\"text\": \"Buy\",\"id\": \"buy\",\"thisWindow\": false,\"highlight\": false,\"auth\": false },{\"children\": [{\"children\": [],\"text\": \"Account Maintenance (EC Admin)\",\"id\": \"account-maint\",\"url\": \"https://shop.cstenet.com/AccountAdmin/ECAdminHelp/\",\"thisWindow\": true,\"highlight\": false,\"auth\": true}, {\"children\": [],\"text\": \"Address Book\",\"id\": \"address-book\",\"url\": \"https://shop.cstenet.com/addressbook\",\"thisWindow\": true,\"highlight\": false,\"auth\": true}, {\"children\": [],\"text\": \"Become a Reseller\",\"id\": \"become-reseller\",\"url\": \"https://shop.cstenet.com/account/become_a_reseller\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [],\"text\": \"Commercial Invoices\",\"id\": \"comm-inv\",\"url\": \"https://shop.cstenet.com/commercialinvoices\",\"thisWindow\": true,\"highlight\": false,\"auth\": true}, {\"children\": [],\"text\": \"Contact Your Main Administrator\",\"id\": \"contact-admin\",\"url\": \"https://shop.cstenet.com/Customer/Account/ContactMainAdministrator\",\"thisWindow\": true,\"highlight\": false,\"auth\": true}, {\"children\": [],\"text\": \"Credit Information\",\"id\": \"credit-info\",\"url\": \"https://shop.cstenet.com/credit/search\",\"thisWindow\": true,\"highlight\": false,\"auth\": true}, {\"children\": [],\"text\": \"Password Maintenance\",\"id\": \"password-maint\",\"url\": \"https://shop.cstenet.com/ContentPages/PasswordMaintenance\",\"thisWindow\": true,\"highlight\": false,\"auth\": true}, {\"children\": [],\"text\": \"Site Options\",\"id\": \"site-options\",\"url\": \"https://shop.cstenet.com/settings\",\"thisWindow\": true,\"highlight\": false,\"auth\": true}, {\"children\": [],\"text\": \"TD DirectPay\",\"id\": \"directpay\",\"url\": \"https://secure.billtrust.com/tddirectpay/ig/signin\",\"thisWindow\": false,\"highlight\": false,\"auth\": true}, {\"children\": [],\"text\": \"2-Step Verification\",\"id\": \"2-step-verification\",\"url\": \"https://www.techdata.com/2step-verification.aspx\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}],\"text\": \"Account\",\"id\": \"account\",\"thisWindow\": false,\"highlight\": false,\"auth\": false },{\"children\": [{\"children\": [],\"text\": \"Careers\",\"id\": \"careers\",\"url\": \"https://qa5.ctenet.com/careers.html\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [],\"text\": \"Company Overview\",\"id\": \"company-overview\",\"url\": \"https://qa5.ctenet.com/about.html\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}, {\"children\": [],\"text\": \"News Room\",\"id\": \"news-room\",\"url\": \"https://qa5.ctenet.com/news.html\",\"thisWindow\": true,\"highlight\": false,\"auth\": false}],\"text\": \"About\",\"id\": \"about\",\"url\": \"https://qa5.ctenet.com/about.html\",\"thisWindow\": false,\"highlight\": false,\"auth\": false }]";
    private static final Logger LOG = LoggerFactory.getLogger(ExperienceFragmentJSServlet.class);

}


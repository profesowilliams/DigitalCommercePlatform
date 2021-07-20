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
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.request.RequestPathInfo;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.engine.SlingRequestProcessor;
import org.apache.sling.settings.SlingSettingsService;
import org.apache.sling.xss.XSSAPI;
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
import java.util.*;

@Component(
        immediate = true,
        service = Servlet.class,
        property = {
                "service.description=JSXF Servlet",
                "service.vendor=techdata.com",
                "sling.servlet.resourcetypes=techdata/components/xfpage",
                "sling.servlet.extensions=js",
                "sling.servlet.selectors=header",
                "sling.servlet.selectors=footer"
        }
)
@Designate(ocd = ExperienceFragmentJSServlet.XFJSServletConfig.class)
public class ExperienceFragmentJSServlet extends SlingSafeMethodsServlet {

    private String htmlClientLibCategoriesJQuery = "/etc.clientlibs/clientlibs/granite/jquery.js";
    private String[] htmlClientLibCategories = null;

    @Reference
    private transient XSSAPI xssapi;

    @ObjectClassDefinition(name = "Techdata XF JS Servlet")
    public @interface XFJSServletConfig {
        @AttributeDefinition(name = "JQuery Library")
        String jqueryPath() default JQUERY_DEFAULT;
        @AttributeDefinition(name = "ClientLib Categories")
        String[] clientlibCategories() default {"techdata.base", "techdata.dependencies", "techdata.site", "techdata.react"};

    }

    @Reference
    private transient RequestResponseFactory requestResponseFactory;

    @Reference
    private transient SlingRequestProcessor requestProcessor;

    @Reference
    private transient HtmlLibraryManager htmlLibraryManager;

    @Reference
    private transient Externalizer externalizer;

    @Reference
    private transient SlingSettingsService settingsService;

    private boolean isPublish = false;

    @Activate
    protected void activate(XFJSServletConfig config) {
        if(settingsService.getRunModes().contains(Externalizer.PUBLISH)) {
            this.isPublish = true;
        }
        this.htmlClientLibCategoriesJQuery = config.jqueryPath();
        this.htmlClientLibCategories = config.clientlibCategories();
    }

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        LOG.debug("Do get for XFJSServlet...");
        PrintWriter out = response.getWriter();
        response.setContentType(ContentType.APPLICATION_JSON.getMimeType());
        response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN,  "*");

        JsonObject xfJson = new JsonObject();
        LOG.debug("JsonObject created...");

        if(isHeader(request)) {
            xfJson.addProperty("reqJquery", getMainLibraries(request, LibraryType.JS, new String[]{htmlClientLibCategoriesJQuery}).getAsString());
            xfJson.add("shopJson", buildShopJSON());
            // get page clientlibs
            xfJson.add("cssLibs", getMainLibraries(request, LibraryType.CSS, htmlClientLibCategories));
            xfJson.add("jsLibs", getMainLibraries(request, LibraryType.JS, htmlClientLibCategories));

            LOG.debug("Added clientlibs...");
        }

        RequestParameter requestParameter = request.getRequestParameter("disableEncrption");
        boolean disableEncryption = false;
        if(requestParameter != null && requestParameter.getString().equals("true")) {
            disableEncryption = true;
        }
        // get html
        String contentHtml = getPageContentHtml(request);
        String formattedString;
        if(!disableEncryption) {
            contentHtml = contentHtml.replace("\"/content", String.format("\"%1$s", getLink(request, "/content")));
            formattedString = new String(Base64.getEncoder().encode(contentHtml.getBytes()));
        } else {
            formattedString = xssapi.encodeForHTML(contentHtml);
        }
        xfJson.addProperty("content", formattedString);

        out.print(xfJson);

        LOG.debug("Exit XFJSServlet...");

    }

    private boolean isHeader(SlingHttpServletRequest request) {
        RequestPathInfo requestPathInfo = request.getRequestPathInfo();
        String[] selectors = requestPathInfo.getSelectors();
        List<String> selectorList = Arrays.asList(selectors);
        return selectorList.contains("header");
    }

    public JsonObject buildShopJSON() {

        JsonObject shopJSON  = new JsonObject();
        shopJSON.add("shopHeader-menuItemsJson", combinedMenuItemsJson());
        shopJSON.add("shopHeader-accountSettingsJson", createAccountSettingsJsonObject());
        shopJSON.add("shopHeader-shopOptionsJson", createShopOptionsJSONObject());
        shopJSON.add("shopHeader-authenticationStatusJson", createAuthJSONObject());

        return shopJSON;
    }

    private JsonArray combinedMenuItemsJson() {
        JsonArray jsonArray = new JsonArray();
        jsonArray.add(buildSystemObject());
        jsonArray.add(buildProjectorObject());
        return jsonArray;
    }

    private JsonObject buildSystemObject() {

        // systems main level start here
        // ------ "Desktops & Workstations" -----
        JsonObject level1 = new JsonObject();
        level1.addProperty("text","Desktops & Workstations");
        level1.addProperty("id","pc-2");
        level1.addProperty("url","https://shop.cstenet.com/products/category/category?cs=500100101&amp;refinements=500100101");
        level1.addProperty(THIS_WINDOW,true);
        level1.addProperty(HIGHLIGHT,false);
        level1.addProperty("auth",false);
        JsonArray level1Children = new JsonArray();

        JsonObject child1 = new JsonObject();

        child1.add(CHILDREN,new JsonArray());
        child1.addProperty("text","Desktops");
        child1.addProperty("id","pc-3");
        child1.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510010101&amp;refinements=510010101");
        child1.addProperty(THIS_WINDOW,true);
        child1.addProperty(HIGHLIGHT,false);
        child1.addProperty("auth",false);
        level1Children.add(child1);

        JsonObject child2 = new JsonObject();
        child2.add(CHILDREN,new JsonArray());
        child2.addProperty("text","Workstations");
        child2.addProperty("id","pc-4");
        child2.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510010102&amp;refinements=510010102");
        child2.addProperty(THIS_WINDOW,true);
        child2.addProperty(HIGHLIGHT,false);
        child2.addProperty("auth",false);
        level1Children.add(child2);

        JsonObject child3 = new JsonObject();
        child3.add(CHILDREN,new JsonArray());
        child3.addProperty("text","Barebone Systems");
        child3.addProperty("id","pc-5");
        child3.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510010103&amp;refinements=510010103");
        child3.addProperty(THIS_WINDOW,true);
        child3.addProperty(HIGHLIGHT,false);
        child3.addProperty("auth",false);
        level1Children.add(child3);

        JsonObject child4 = new JsonObject();
        child4.add(CHILDREN,new JsonArray());
        child4.addProperty("text","Thin Clients");
        child4.addProperty("id","pc-6");
        child4.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510010104&amp;refinements=510010104");
        child4.addProperty(THIS_WINDOW,true);
        child4.addProperty(HIGHLIGHT,false);
        child4.addProperty("auth",false);
        level1Children.add(child4);
        level1.add(CHILDREN, level1Children);

        // ------ "Notebooks & Accessories" -----
        JsonObject level2 = new JsonObject();
        JsonArray level2Array = new JsonArray();
        level2.addProperty("text","Notebooks & Accessories");
        level2.addProperty("id","pc-7");
        level2.addProperty("url","https://shop.cstenet.com/products/category/category?cs=500100102&amp;refinements=500100102");
        level2.addProperty(THIS_WINDOW,true);
        level2.addProperty(HIGHLIGHT,false);
        level2.addProperty("auth",false);

        JsonObject child5 = new JsonObject();
        child5.add(CHILDREN,new JsonArray());
        child5.addProperty("text","Chromebooks");
        child5.addProperty("id","pc-15");
        child5.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510010216&amp;refinements=510010216");
        child5.addProperty(THIS_WINDOW,true);
        child5.addProperty(HIGHLIGHT,false);
        child5.addProperty("auth",false);
        level2Array.add(child5);

        JsonObject child6 = new JsonObject();
        child6.add(CHILDREN,new JsonArray());
        child6.addProperty("text","Notebook & Tablet Accessories");
        child6.addProperty("id","pc-14");
        child6.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510010215&amp;refinements=510010215");
        child6.addProperty(THIS_WINDOW,true);
        child6.addProperty(HIGHLIGHT,false);
        child6.addProperty("auth",false);
        level2Array.add(child6);

        JsonObject child7 = new JsonObject();
        child7.add(CHILDREN,new JsonArray());
        child7.addProperty("text","Notebook Carrying Cases");
        child7.addProperty("id","pc-13");
        child7.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510010211&amp;refinements=510010211");
        child7.addProperty(THIS_WINDOW,true);
        child7.addProperty(HIGHLIGHT,false);
        child7.addProperty("auth",false);
        level2Array.add(child7);

        JsonObject child8 = new JsonObject();
        child8.add(CHILDREN,new JsonArray());
        child8.addProperty("text","Notebook Docking Stations");
        child8.addProperty("id","pc-12");
        child8.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510010210&amp;refinements=510010210");
        child8.addProperty(THIS_WINDOW,true);
        child8.addProperty(HIGHLIGHT,false);
        child8.addProperty("auth",false);
        level2Array.add(child8);

        JsonObject child9 = new JsonObject();
        child9.add(CHILDREN,new JsonArray());
        child9.addProperty("text","Thin Client Notebooks");
        child9.addProperty("id","pc-11");
        child9.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510010209&amp;refinements=510010209");
        child9.addProperty(THIS_WINDOW,true);
        child9.addProperty(HIGHLIGHT,false);
        child9.addProperty("auth",false);
        level2Array.add(child9);

        JsonObject child10 = new JsonObject();
        child10.add(CHILDREN,new JsonArray());
        child10.addProperty("text","Mobile Workstations");
        child10.addProperty("id","pc-10");
        child10.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510010205&amp;refinements=510010205");
        child10.addProperty(THIS_WINDOW,true);
        child10.addProperty(HIGHLIGHT,false);
        child10.addProperty("auth",false);
        level2Array.add(child10);

        JsonObject child11 = new JsonObject();
        child11.add(CHILDREN,new JsonArray());
        child11.addProperty("text","Notebooks");
        child11.addProperty("id","pc-8");
        child11.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510010201&amp;refinements=510010201");
        child11.addProperty(THIS_WINDOW,true);
        child11.addProperty(HIGHLIGHT,false);
        child11.addProperty("auth",false);
        level2Array.add(child11);

        JsonObject child12 = new JsonObject();
        child12.add(CHILDREN,new JsonArray());
        child12.addProperty("text","Ultrabooks");
        child12.addProperty("id","pc-9");
        child12.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510010202&amp;refinements=510010202");
        child12.addProperty(THIS_WINDOW,true);
        child12.addProperty(HIGHLIGHT,false);
        child12.addProperty("auth",false);
        level2Array.add(child12);
        level2.add(CHILDREN, level2Array);

        // ------ "Tablets & Ebook readers" -----
        JsonObject level3 = new JsonObject();
        JsonArray level3Array = new JsonArray();
        JsonObject child13 = new JsonObject();
        child13.add(CHILDREN,new JsonArray());
        child13.addProperty("text","Tablets & Handhelds");
        child13.addProperty("id","pc-17");
        child13.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510010301&amp;refinements=510010301");
        child13.addProperty(THIS_WINDOW,true);
        child13.addProperty(HIGHLIGHT,false);
        child13.addProperty("auth",false);
        level3Array.add(child13);

        level3.addProperty("text","Tablets & eBook readers");
        level3.addProperty("id","pc-16");
        level3.addProperty("url","https://shop.cstenet.com/products/category/category?cs=500100103&amp;refinements=500100103");
        level3.addProperty(THIS_WINDOW,true);
        level3.addProperty(HIGHLIGHT,false);
        level3.addProperty("auth",false);
        level3.add(CHILDREN, level3Array);

        // ------ "Servers" -----
        JsonObject level4 = new JsonObject();
        JsonArray level4Array = new JsonArray();
        JsonObject child14 = new JsonObject();
        child14.add(CHILDREN,new JsonArray());
        child14.addProperty("text","Tower");
        child14.addProperty("id","pc-19");
        child14.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510010401&amp;refinements=510010401");
        child14.addProperty(THIS_WINDOW,true);
        child14.addProperty(HIGHLIGHT,false);
        child14.addProperty("auth",false);
        level4Array.add(child14);

        JsonObject child15 = new JsonObject();
        child15.add(CHILDREN,new JsonArray());
        child15.addProperty("text","Rack");
        child15.addProperty("id","pc-20");
        child15.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510010402&amp;refinements=510010402");
        child15.addProperty(THIS_WINDOW,true);
        child15.addProperty(HIGHLIGHT,false);
        child15.addProperty("auth",false);
        level4Array.add(child15);

        JsonObject child16 = new JsonObject();
        child16.add(CHILDREN,new JsonArray());
        child16.addProperty("text","Blade");
        child16.addProperty("id","pc-21");
        child16.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510010403&amp;refinements=510010403");
        child16.addProperty(THIS_WINDOW,true);
        child16.addProperty(HIGHLIGHT,false);
        child16.addProperty("auth",false);
        level4Array.add(child16);

        JsonObject child17 = new JsonObject();
        child17.add(CHILDREN,new JsonArray());
        child17.addProperty("text","Traffic Balancers & Optimizers");
        child17.addProperty("id","pc-22");
        child17.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510010407&amp;refinements=510010407");
        child17.addProperty(THIS_WINDOW,true);
        child17.addProperty(HIGHLIGHT,false);
        child17.addProperty("auth",false);
        level4Array.add(child17);

        level4.addProperty("text","Servers");
        level4.addProperty("id","pc-18");
        level4.addProperty("url","https://shop.cstenet.com/products/category/category?cs=500100104&amp;refinements=500100104");
        level4.addProperty(THIS_WINDOW,true);
        level4.addProperty(HIGHLIGHT,false);
        level4.addProperty("auth",false);
        level4Array.add(child1);
        level4.add(CHILDREN, level4Array);

        // point of sale
        JsonObject level5 = new JsonObject();
        JsonArray level5Array = new JsonArray();
        JsonObject child18 = new JsonObject();
        child18.add(CHILDREN,new JsonArray());
        child18.addProperty("text","POS Monitors");
        child18.addProperty("id","pc-24");
        child18.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510010503&amp;refinements=510010503");
        child18.addProperty(THIS_WINDOW,true);
        child18.addProperty(HIGHLIGHT,false);
        child18.addProperty("auth",false);
        level5Array.add(child18);

        JsonObject child19 = new JsonObject();
        child19.add(CHILDREN,new JsonArray());
        child19.addProperty("text","Cash Drawers");
        child19.addProperty("id","pc-25");
        child19.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510010505&amp;refinements=510010505");
        child19.addProperty(THIS_WINDOW,true);
        child19.addProperty(HIGHLIGHT,false);
        child19.addProperty("auth",false);
        level5Array.add(child19);

        level5.addProperty("text","Point Of Sale Equipment");
        level5.addProperty("id","pc-23");
        level5.addProperty("url","https://shop.cstenet.com/products/category/category?cs=500100105&amp;refinements=500100105");
        level5.addProperty(THIS_WINDOW,true);
        level5.addProperty(HIGHLIGHT,false);
        level5.addProperty("auth",false);
        level5.add(CHILDREN, level5Array);

        // systems
        JsonObject systems = new JsonObject();
        systems.addProperty("text","Systems");
        systems.addProperty("id","pc-1");
        systems.addProperty("url","https://shop.cstenet.com/products/category/category?cs=500001001&amp;refinements=500001001");
        systems.addProperty(THIS_WINDOW,true);
        systems.addProperty(HIGHLIGHT,false);
        systems.addProperty("auth",false);
        JsonArray systemsChildren = new JsonArray();
        systemsChildren.add(level1);
        systemsChildren.add(level2);
        systemsChildren.add(level3);
        systemsChildren.add(level4);
        systemsChildren.add(level5);
        systems.add(CHILDREN, systemsChildren);

        return systems;
    }

    private JsonObject buildProjectorObject() {

        // monitors object
        JsonObject monitors = new JsonObject();
        JsonArray monitorsChildren = new JsonArray();
        monitors.addProperty("text","Monitors");
        monitors.addProperty("id","pc-27");
        monitors.addProperty("url","https://shop.cstenet.com/products/category/category?cs=500100201&refinements=500100201");
        monitors.addProperty(THIS_WINDOW,true);
        monitors.addProperty(HIGHLIGHT,false);
        monitors.addProperty("auth",false);

        JsonObject mChild2 = new JsonObject();
        mChild2.add(CHILDREN,new JsonArray());
        mChild2.addProperty("text","Computer");
        mChild2.addProperty("id","pc-28");
        mChild2.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510020101&refinements=510020101");
        mChild2.addProperty(THIS_WINDOW,true);
        mChild2.addProperty(HIGHLIGHT,false);
        mChild2.addProperty("auth",false);
        monitorsChildren.add(mChild2);

        JsonObject mChild3 = new JsonObject();
        mChild3.add(CHILDREN,new JsonArray());
        mChild3.addProperty("text","Accessories");
        mChild3.addProperty("id","pc-29");
        mChild3.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510020106&refinements=510020106");
        mChild3.addProperty(THIS_WINDOW,true);
        mChild3.addProperty(HIGHLIGHT,false);
        mChild3.addProperty("auth",false);
        monitorsChildren.add(mChild3);
        monitors.add(CHILDREN, monitorsChildren);

        // projector object
        JsonObject projector = new JsonObject();
        JsonArray projectorChildren = new JsonArray();
        JsonObject child1 = new JsonObject();

        child1.add(CHILDREN,new JsonArray());
        child1.addProperty("text","DLP");
        child1.addProperty("id","pc-31");
        child1.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510020301&amp;refinements=510020301");
        child1.addProperty(THIS_WINDOW,true);
        child1.addProperty(HIGHLIGHT,false);
        child1.addProperty("auth",false);
        projectorChildren.add(child1);

        JsonObject child2 = new JsonObject();

        child2.add(CHILDREN,new JsonArray());
        child2.addProperty("text","LCD");
        child2.addProperty("id","pc-32");
        child2.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510020302&amp;refinements=510020302");
        child2.addProperty(THIS_WINDOW,true);
        child2.addProperty(HIGHLIGHT,false);
        child2.addProperty("auth",false);
        projectorChildren.add(child2);

        JsonObject child3 = new JsonObject();
        child3.add(CHILDREN,new JsonArray());
        child3.addProperty("text","Cables");
        child3.addProperty("id","pc-33");
        child3.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510020307&amp;refinements=510020307");
        child3.addProperty(THIS_WINDOW,true);
        child3.addProperty(HIGHLIGHT,false);
        child3.addProperty("auth",false);
        projectorChildren.add(child3);

        JsonObject child4 = new JsonObject();
        child4.add(CHILDREN,new JsonArray());
        child4.addProperty("text","Accessories");
        child4.addProperty("id","pc-34");
        child4.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510020309&amp;refinements=510020309");
        child4.addProperty(THIS_WINDOW,true);
        child4.addProperty(HIGHLIGHT,false);
        child4.addProperty("auth",false);
        projectorChildren.add(child4);

        JsonObject child5 = new JsonObject();
        child5.add(CHILDREN,new JsonArray());
        child5.addProperty("text","Lamps");
        child5.addProperty("id","pc-35");
        child5.addProperty("url","https://shop.cstenet.com/products/category/category?cs=510020311&amp;refinements=510020311");
        child5.addProperty(THIS_WINDOW,true);
        child5.addProperty(HIGHLIGHT,false);
        child5.addProperty("auth",false);
        projectorChildren.add(child5);

        projector.addProperty("text","Projectors");
        projector.addProperty("id","pc-30");
        projector.addProperty("url","https://shop.cstenet.com/products/category/category?cs=500100203&amp;refinements=500100203");
        projector.addProperty(THIS_WINDOW,true);
        projector.addProperty(HIGHLIGHT,false);
        projector.addProperty("auth",false);
        projector.add(CHILDREN, projectorChildren);

        // displays and monitors object
        JsonObject displaysMonitorsProjectors = new JsonObject();
        JsonArray displaysMonitorsChildren = new JsonArray();
        displaysMonitorsProjectors.addProperty("text","Display & Projectors");
        displaysMonitorsProjectors.addProperty("id","pc-25");
        displaysMonitorsProjectors.addProperty("url","https://shop.cstenet.com/products/category/category?cs=500100201&refinements=500100201");
        displaysMonitorsProjectors.addProperty(THIS_WINDOW,true);
        displaysMonitorsProjectors.addProperty(HIGHLIGHT,false);
        displaysMonitorsProjectors.addProperty("auth",false);
        displaysMonitorsChildren.add(monitors);
        displaysMonitorsChildren.add(projector);
        displaysMonitorsProjectors.add(CHILDREN, displaysMonitorsChildren);
        return displaysMonitorsProjectors;
    }

    private JsonObject createAccountSettingsJsonObject() {
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
        return accountSettingsJsonData;
    }

    private JsonObject createShopOptionsJSONObject() {
        JsonObject shopOptionsJsonData = new JsonObject();
        shopOptionsJsonData.addProperty("shopUrl"," http,//localhost,63018");
        shopOptionsJsonData.addProperty("corporateUrl","http,//exwb11preview.dev.web.us.tdworldwide.com");
        shopOptionsJsonData.addProperty("legacyUrl","http,//exwb11preview.dev.web.us.tdworldwide.com");
        shopOptionsJsonData.addProperty("typeAheadUrl","https://typeahead.dev.web.us.tdworldwide.com");
        shopOptionsJsonData.addProperty("shopDomain","shop.dev.web.us.tdworldwide.com");
        shopOptionsJsonData.addProperty("corporateDomain","exwb11preview.dev.web.us.tdworldwide.com/");
        shopOptionsJsonData.addProperty("legacyDomain","exwb11preview.dev.web.us.tdworldwide.com");
        shopOptionsJsonData.addProperty("cookieDomain",".us.tdworldwide.com");
        shopOptionsJsonData.addProperty("addManufacturerStoresToId","research");
        shopOptionsJsonData.addProperty("techSelectContentUrl","https://shop.techdata.com/siteredirect/?referrer=shop.techdata.com&destination=http,//content.techselect.techdata.com&authPage=login.aspx&landingPage=http,//content.techselect.techdata.com");
        shopOptionsJsonData.addProperty("myOrderTrackerUrl","https://shop.dev.web.us.tdworldwide.com/siteredirect/?referrer=shop.dev.web.us.tdworldwide.com&destination=http,//www.myordertracker.com&authPage=/us/default.aspx&landingPage=http,//www.myordertracker.com/reseller/MyOrderTracker.aspx");
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
        return shopOptionsJsonData;
    }
    private JsonObject createAuthJSONObject() {
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
        return authenticationStatusJsonData;
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

        String resourcePath = xfResource.getPath() + "/root.noclientlibs.atoffer.html";
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

    private static final String THIS_WINDOW = "thisWindow";
    private static final String HIGHLIGHT = "highlight";
    private static final String CHILDREN = "children";
    private static final String JQUERY_DEFAULT = "jquery";
    private static final String APPS = "/apps/";
    private static final String LIBS = "/libs/";
    private static final String ETC_CLIENTLIBS = "/etc.clientlibs/";
    private static final Logger LOG = LoggerFactory.getLogger(ExperienceFragmentJSServlet.class);
}

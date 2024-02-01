package com.tdscore.core.models;

import com.adobe.cq.export.json.ContainerExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.wcm.core.components.models.HtmlPageItem;
import com.adobe.cq.wcm.core.components.models.NavigationItem;
import com.adobe.cq.wcm.core.components.models.Page;
import com.adobe.cq.wcm.core.components.models.datalayer.ComponentData;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagConstants;
import com.day.cq.tagging.TagManager;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.via.ResourceSuperType;
import org.apache.sling.xss.XSSAPI;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.tdscore.core.services.IntouchRequest;
import com.tdscore.core.services.IntouchRequestType;
import com.tdscore.core.services.IntouchRetrieveDataService;
import java.io.UnsupportedEncodingException;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import com.tdscore.core.slingcaconfig.IntouchConfiguration;
import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Stream;
import org.apache.sling.caconfig.ConfigurationBuilder;
import java.net.URLDecoder;

import static com.tdscore.core.util.Constants.COUNTRY_PAGE;
import static com.tdscore.core.util.Constants.LOCALE_PAGE;

@Model(adaptables = SlingHttpServletRequest.class,
        adapters = {Page.class, ContainerExporter.class},
        resourceType = PageIntouchImpl.RESOURCE_TYPE)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
        extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class PageIntouchImpl extends PageImpl {

    private static final Logger LOG = LoggerFactory.getLogger(PageImpl.class);
    protected static final String RESOURCE_TYPE = "tds-core/components/intouchpage/v1/intouchpage";
    private static final String PAGE_TYPE = "pageType";
    
    @OSGiService
    private IntouchRetrieveDataService intouchService;

    @Self
    private SlingHttpServletRequest request;

    @Inject
    private SlingHttpServletResponse response;

    private XSSAPI xssapi;

    @Inject
    public PageIntouchImpl(XSSAPI xssapi) {
        super(xssapi);
        this.xssapi = xssapi;
    }

    @PostConstruct
    protected void initModel() {
        LOG.debug("Inside PageImpl Model");

        // to avoid Dispatcher cache for intouch pages (otherwise saleslogin is shared between different users)
        // maybe we can move salesLogin (and intouch JS files - which contains url + saleslogin) somewhere and enable cache again?
        String salesLogin = getSalesLogin();
        if(!"".equals(salesLogin)) {
            response.setHeader("Dispatcher", "no-cache");
            // its used only as a information for developers because Dispatcher header is removed from response by Dispatcher itself
            response.setHeader("X-Dispatcher", "no-cache"); 
        }
    }

    public String getIntouchJSScriptsData() {
        IntouchConfiguration intouchConfiguration = currentPage.adaptTo(ConfigurationBuilder.class).as(IntouchConfiguration.class);
        String intouchJSAPIUrl = intouchConfiguration.jsAPIUrl();
        IntouchRequest intouchRequest = new IntouchRequest(IntouchRequestType.JS_REQUEST.getId(), addSalesLoginToUrl(intouchJSAPIUrl), "UK", "en-US");
        return intouchService.fetchScriptsData(intouchRequest);
    }

    private String addSalesLoginToUrl(String url) {
        String salesLogin = getSalesLogin();

        if(!"".equals(salesLogin)) {
            url = url.replace("/MVC/", "/MVC/" + salesLogin + "/");
        }

        return url;
    }

    public String getSalesLogin() {
        try {
            String queryString = request.getQueryString();       
            List<String> salesLogin = splitQuery(queryString).get("saleslogin");
            return salesLogin != null ? salesLogin.get(0) : "";
        } 
        catch (UnsupportedEncodingException ex) {
        }

        return "";
    }
    
    private static Map<String, List<String>> splitQuery(String query) throws UnsupportedEncodingException {
        final Map<String, List<String>> query_pairs = new LinkedHashMap<String, List<String>>();
        if(query == null) return query_pairs;
        
        final String[] pairs = query.split("&");
        for (String pair : pairs) {
            final int idx = pair.indexOf("=");
            final String key = idx > 0 ? URLDecoder.decode(pair.substring(0, idx), "UTF-8") : pair;
            if (!query_pairs.containsKey(key)) {
                query_pairs.put(key.toLowerCase(), new LinkedList<String>());
            }
            final String value = idx > 0 && pair.length() > idx + 1 ? URLDecoder.decode(pair.substring(idx + 1), "UTF-8") : null;
            query_pairs.get(key.toLowerCase()).add(value);
        }
        return query_pairs;
    }
}
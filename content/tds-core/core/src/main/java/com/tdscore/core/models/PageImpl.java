package com.tdscore.core.models;

import com.adobe.cq.export.json.ContainerExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.wcm.core.components.models.HtmlPageItem;
import com.adobe.cq.wcm.core.components.models.NavigationItem;
import com.adobe.cq.wcm.core.components.models.Page;
import com.adobe.cq.wcm.core.components.models.datalayer.ComponentData;
import com.adobe.cq.wcm.core.components.models.datalayer.builder.DataLayerBuilder;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
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

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static com.tdscore.core.util.Constants.COUNTRY_PAGE;
import static com.tdscore.core.util.Constants.LOCALE_PAGE;

@Model(adaptables = SlingHttpServletRequest.class,
        adapters = {Page.class, ContainerExporter.class},
        resourceType = PageImpl.RESOURCE_TYPE)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
        extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class PageImpl implements Page {

    private static final Logger LOG = LoggerFactory.getLogger(PageImpl.class);
    protected static final String RESOURCE_TYPE = "tds-core/components/page/v1/page";
    private static final String PAGE_TYPE = "pageType";

    @ScriptVariable
    protected com.day.cq.wcm.api.Page currentPage;

    @Self
    @Via(type = ResourceSuperType.class)
    private Page basePage;

    @ScriptVariable
    protected ValueMap pageProperties;

    @Self
    private SlingHttpServletRequest request;

    private XSSAPI xssapi;

    @Inject
    public PageImpl(XSSAPI xssapi) {
        this.xssapi = xssapi;
    }

    @PostConstruct
    protected void initModel() {
        LOG.debug("Inside PageImpl Model");
    }

    @Override
    public String getLanguage() {
        return basePage.getLanguage();
    }

    @Override
    public String getCssClassNames() {
        return basePage.getCssClassNames();
    }

    @Override
    public String getId() {
        return basePage.getId();
    }

    @Override
    public ComponentData getData() {
        Resource currentPageResource = currentPage.getContentResource();
        if(currentPageResource == null) return null;
        return DataLayerBuilder.forPage()
                .withId(this::getId)
                .withTitle(this::getTitle)
                .withType(currentPageResource::getResourceType)
                .withLinkUrl(this::getPageUrl)
                .withLanguage(() -> currentPage.getLanguage().getLanguage())
                .build();
    }

//    @Override
//    public ComponentData getData() {
//        Resource currentPageResource = currentPage.getContentResource();
//        // Use ComponentUtils to verify if the DataLayer is enabled
//        Map<String, String> categoryMap = new HashMap<>();
//        categoryMap.put(PAGE_TYPE, getPageType());
//        String[] siteSections = getSiteSections();
//        for (int i = 0; i < siteSections.length; i++) {
//            categoryMap.put("siteSection"+ (i + 1), siteSections[i]);
//        }
//        Map<String, String> errorMap = new HashMap<>();
//        errorMap.put(ERROR_CODE, getErrorCode());
//        errorMap.put(ERROR_NAME, getErrorName());
//        //Create a map of properties we want to expose
//        Map<String, Object> analyticsPageProperties = new HashMap<>();
//        analyticsPageProperties.put("@type", currentPageResource.getResourceType());
//        analyticsPageProperties.put("repo:modifyDate", currentPage.getLastModified().toString());
//        analyticsPageProperties.put("dc:title", currentPage.getTitle());
//        analyticsPageProperties.put("dc:description", currentPage.getDescription());
//        analyticsPageProperties.put("repo:path", currentPage.getPath());
//        analyticsPageProperties.put("xdm:template", currentPage.getTemplate().getPath());
//        analyticsPageProperties.put("xdm:language", currentPage.getLanguage().getLanguage());
//        analyticsPageProperties.put("dc:currency", getCurrencyCode());
//        analyticsPageProperties.put("xdm:country", getCurrencyCode());
//        analyticsPageProperties.put("dc:pageName", getAnalyticsPageName());
//        analyticsPageProperties.put("dc:server", request.getServerName());
//        analyticsPageProperties.put("dc:url", getPageUrl());
//        analyticsPageProperties.put("category", categoryMap);
//        analyticsPageProperties.put("error", errorMap);
//
//        //Use AEM Core Component utils to get a unique identifier for the Byline component (in case multiple are on the page)
//        String id = ComponentUtils.getId(currentPageResource, this.currentPage, this.componentContext);
//        // Return the bylineProperties as a JSON String with a key of the bylineResource's ID
//        try {
//            return String.format("{\"%s\":%s}",
//                    id,
//                    // Use the ObjectMapper to serialize the bylineProperties to a JSON string
//                    new ObjectMapper().writeValueAsString(analyticsPageProperties));
//        } catch (JsonProcessingException e) {
//            LOG.error("Unable to generate dataLayer JSON string", e);
//        }
//
//        return null;
//    }

    @Override
    public NavigationItem getRedirectTarget() {
        return basePage.getRedirectTarget();
    }


    public String getAnalyticsPageName() {
        com.day.cq.wcm.api.Page localePage = currentPage.getAbsoluteParent(LOCALE_PAGE);
        if(localePage != null) {
            String currentPagePath = currentPage.getPath();
            String localePagePath = localePage.getPath();
            String prefix = localePage.getParent().getName() + ":" + localePage.getName();
            if (currentPagePath.equals(localePagePath)) {
                return prefix + ":" + pageProperties.get(PAGE_TYPE, StringUtils.EMPTY);
            }
            String relativePagePath = currentPage.getPath().replace(localePagePath, StringUtils.EMPTY);
            return prefix + relativePagePath.replace("/", ":");
        }
        return StringUtils.EMPTY;
    }

    public String getCountry() {
        com.day.cq.wcm.api.Page countryPage = currentPage.getAbsoluteParent(COUNTRY_PAGE);
        String country = "us";
        if(countryPage != null) {
            country = countryPage.getName();
        }
        return country;
    }

    public String getPageUrl() {
        return xssapi.encodeForHTML(request.getRequestURL().toString());
    }

    public String getPageHost() {
        return request.getServerName();
    }

    public String getCurrencyCode() {
        com.day.cq.wcm.api.Page countryPage = currentPage.getAbsoluteParent(COUNTRY_PAGE);
        if(countryPage != null) {
            ValueMap countryPageProperties = countryPage.getProperties();
            return countryPageProperties.get("currency", "USD");
        }
        return StringUtils.EMPTY;
    }

    public String getPageType() {
        return pageProperties.get(PAGE_TYPE, StringUtils.EMPTY);
    }

    public String[] getSiteSections() {
        com.day.cq.wcm.api.Page localePage = currentPage.getAbsoluteParent(LOCALE_PAGE);
        String[] siteSections = {"n/a", "n/a", "n/a", "n/a"};
        if(localePage != null && !currentPage.getPath().contains("/content/experience-fragments")) {
            String relativePagePath = currentPage.getPath().replace(localePage.getPath(), StringUtils.EMPTY);
            List<String> hierarchyPagesList = buildHierarchyList(relativePagePath.split("/"));
            for (int i = 0; i < hierarchyPagesList.size(); i++) {
                String path = hierarchyPagesList.get(i);
                if (StringUtils.isNotEmpty(path)) {
                    siteSections[i - 1] = path;
                }
            }
        }
        return siteSections;
    }

    private List<String> buildHierarchyList(String[] hierarchyPages) {
        List<String> hierarchyPagesList;
        if (hierarchyPages.length == 1) {
            hierarchyPagesList = Collections.singletonList(pageProperties.get(PAGE_TYPE, StringUtils.EMPTY));
        } else {
            hierarchyPagesList = Arrays.asList(hierarchyPages);
        }
        return hierarchyPagesList;
    }

    @Override
    public String getTitle() {
        return basePage.getTitle();
    }

    @Override
    public String getBrandSlug() {
        return basePage.getBrandSlug();
    }

    @Override
    public String[] getKeywords() {
        return basePage.getKeywords();
    }

    @Override
    public String getTemplateName() {
        return basePage.getTemplateName();
    }

    @Override
    public String getDesignPath() {
        return basePage.getDesignPath();
    }

    @Override
    public String getStaticDesignPath() {
        return basePage.getStaticDesignPath();
    }

    @Override
    public String[] getClientLibCategories() {
        return basePage.getClientLibCategories();
    }

    @Override
    public String[] getClientLibCategoriesJsHead() {
        return basePage.getClientLibCategoriesJsHead();
    }

    @Override
    public String[] getClientLibCategoriesJsBody() {
        return basePage.getClientLibCategoriesJsBody();
    }

    @Override
    public boolean hasCloudconfigSupport() {
        return basePage.hasCloudconfigSupport();
    }

    @Override
    public String getAppResourcesPath() {
        return basePage.getAppResourcesPath();
    }

    @Override
    public List<HtmlPageItem> getHtmlPageItems() {
        return basePage.getHtmlPageItems();
    }

    public String getError404() {
        com.day.cq.wcm.api.Page localePage = currentPage.getAbsoluteParent(LOCALE_PAGE);
        if(localePage != null) {
            String errorPagesPath = localePage.getProperties().get("errorPages", String.class);
            if (StringUtils.isNotEmpty(errorPagesPath) && currentPage.getPath().contains(errorPagesPath)) {
                return "true";
            }
        }
        return "false";

    }

    public String getErrorCode() {
        String errorCode = null;
        if (getError404().equals("true")) {
            com.day.cq.wcm.api.Page localePage = currentPage.getAbsoluteParent(LOCALE_PAGE);
            errorCode = localePage.getProperties().get(ERROR_CODE, String.class);
        }
        return pageProperties.get(ERROR_CODE, errorCode);
    }

    public String getErrorName() {
        String errorName = null;
        if(getError404().equals("true")) {
            com.day.cq.wcm.api.Page localePage = currentPage.getAbsoluteParent(LOCALE_PAGE);
            errorName = localePage.getProperties().get(ERROR_NAME, String.class);
        }
        return pageProperties.get(ERROR_NAME, errorName);
    }

    private static final String ERROR_CODE = "errorCode";
    private static final String ERROR_NAME = "errorName";
}


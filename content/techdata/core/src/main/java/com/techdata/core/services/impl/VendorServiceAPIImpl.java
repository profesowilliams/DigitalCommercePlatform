package com.techdata.core.services.impl;

import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.dam.cfm.ContentFragmentException;
import com.adobe.cq.dam.cfm.FragmentTemplate;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.WCMException;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.techdata.core.services.VendorServiceAPI;
import com.techdata.core.slingcaconfig.VendorServiceConfig;
import com.techdata.core.util.Constants;
import com.techdata.core.util.ContentFragmentUtil;
import com.techdata.core.util.UIServiceHelper;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.sling.api.resource.*;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import static com.techdata.core.util.Constants.*;

@Component(service = VendorServiceAPI.class, immediate = true, enabled = true)
@Designate(ocd = VendorServiceConfig.class)
public class VendorServiceAPIImpl implements VendorServiceAPI {

    @Reference
    private UIServiceHelper uiServiceHelper;

    private String rootPagePath;
    private String contentFragmentPath;
    private String importAPI;

    private ContentFragmentUtil fragmentUtil = new ContentFragmentUtil();

    @Override
    public int fetchDataFromAPI(ResourceResolver resolver) throws PersistenceException, ContentFragmentException, WCMException {
        JsonObject vendorJsonResponse =
                uiServiceHelper.getUIServiceJSONResponse(importAPI, "111jjj111");
        JsonArray vendorsArray = vendorJsonResponse.getAsJsonObject("content").getAsJsonArray("items");
        saveVendorsAsContentFragment(vendorsArray, resolver);
        return vendorsArray.size();
    }


    /**
     *       -
     * @param vendorsArray
     * @param resourceResolver
     * @throws PersistenceException
     * @throws RepositoryException
     * @throws ContentFragmentException
     */
    private void saveVendorsAsContentFragment(JsonArray vendorsArray, ResourceResolver resourceResolver)
            throws PersistenceException, ContentFragmentException, WCMException {
        log.debug("inside processSynchContentFragments. Processing for path {}", rootPagePath);
        Resource contentFragmentRootResource = resourceResolver.getResource(contentFragmentPath);
        Resource template = resourceResolver.getResource(Constants.VENDOR_CF_MODEL_PATH);

        if(template != null) {
            FragmentTemplate fragmentTemplate = template.adaptTo(FragmentTemplate.class);
            if(fragmentTemplate != null) {
                for (JsonElement jsonElement : vendorsArray) {
                    JsonObject jsonItemObject = jsonElement.getAsJsonObject();
                    String name = jsonItemObject.get(VENDOR_NAME).getAsString().toLowerCase();
                    String title = jsonItemObject.get(Constants.VENDOR_TITLE).getAsString();
                    ContentFragment cfm = fragmentTemplate.createFragment(contentFragmentRootResource, name, title);
                    fragmentUtil.setContentElements(cfm, jsonItemObject);
                    populateAdditionalAttributes(name, title, cfm, jsonItemObject);
                }
                resourceResolver.commit();
                resourceResolver.refresh();
            }

        }

    }

    private void populateAdditionalAttributes(String name, String title, ContentFragment cfm,
                                              JsonObject jsonItemObject) throws WCMException, PersistenceException {
        Resource cfmResource = cfm.adaptTo(Resource.class);
        Resource masterResource = cfmResource.getChild("jcr:content/data/master");
        if(masterResource != null) {
            ModifiableValueMap map = masterResource.adaptTo(ModifiableValueMap.class);
            if(map != null) {
                String fcar = name.substring(0, 1);

                map.put("first-character", fcar.toUpperCase());
                String[] alphabetTags = getAlphabetTags(fcar.toLowerCase());
                map.put("vendor-alpha-group", alphabetTags);
                String featuredVendorFlag = "false";
                String featuredVendorTag = StringUtils.EMPTY;
                if (Objects.equals(jsonItemObject.get(VENDOR_DESIGNATION).getAsString().toLowerCase(), "true")) {
                    featuredVendorTag = "vendor-designation:preferred";
                    featuredVendorFlag = "true";
                }
                map.put("featured-vendor", featuredVendorFlag);
                String[] solutionTags = jsonItemObject.get(VENDOR_SOLUTIONS).getAsString().split(",");
                map.put(VENDOR_SOLUTIONS, solutionTags);
                String[] categoryTags = jsonItemObject.get(VENDOR_CATEGORY).getAsString().split(",");
                map.put(VENDOR_CATEGORY, categoryTags);
                map.put(VENDOR_PAGE_LINK, rootPagePath + "/" + name);
                map.put(VENDOR_PAGE_LABEL, title);
                map.put(VENDOR_TITLE, title);
                String overview = jsonItemObject.get(OVERVIEW).getAsString();
                String[] allTags = ArrayUtils.addAll(alphabetTags, solutionTags);
                allTags = ArrayUtils.addAll(allTags, categoryTags);
                allTags = ArrayUtils.addAll(allTags, featuredVendorTag);
                createVendorPage(masterResource, name, title, overview, allTags, cfmResource);
            }
        }
    }

    private void createVendorPage(Resource masterResource, String name, String title, String overview, String[] allTags,
                                  Resource cfmResource) throws PersistenceException, WCMException {
        // page creation
        ResourceResolver resourceResolverForPage = masterResource.getResourceResolver();
        PageManager pageManager = resourceResolverForPage.adaptTo(PageManager.class);
        Page vendorPage = pageManager.create(rootPagePath, name, "/conf/techdata/settings/wcm/templates/vendor-page", title);
        Resource containerResource = vendorPage.getContentResource().getChild("root/container");
        ModifiableValueMap vendorPageContentResourceProps = vendorPage.getContentResource().adaptTo(ModifiableValueMap.class);
        vendorPageContentResourceProps.put("cq:tags", allTags);

        Map<String, Object> pageDataMap = new HashMap<>();
        pageDataMap.put("paragraphScope", "all");
        pageDataMap.put("displayMode", "multi");
        pageDataMap.put("variationName", "master");
        pageDataMap.put("text", overview);
        pageDataMap.put("elementNames", new String[] {
                VENDOR_NAME, VENDOR_TITLE, VENDOR_DESIGNATION, VENDOR_ABBR, OVERVIEW, VENDOR_ICON
        });
        pageDataMap.put("sling:resourceType", "techdata/components/contentfragment");
        pageDataMap.put("fragmentPath", cfmResource.getPath());

        resourceResolverForPage.create(containerResource, "contentfragment", pageDataMap);
    }

    private String[] getAlphabetTags(String firstChar) {

        String firstCharTag = TAG_PREFIX + firstChar;
        if (firstChar.matches("^[a-eA-E]")){
            return new String[]{firstCharTag, TAG_PREFIX + "a-e"};
        } else if (firstChar.matches("^[f-j]")){
            return new String[]{firstCharTag, TAG_PREFIX + "f-j"};
        } else if (firstChar.matches("^[k-o]")){
            return new String[]{firstCharTag,  TAG_PREFIX + "k-o"};
        } else if (firstChar.matches("^[p-t]")){
            return new String[]{firstCharTag,  TAG_PREFIX + "p-t"};
        } else if (firstChar.matches("^[u-z]")){
                return new String[]{firstCharTag,  TAG_PREFIX + "u-z"};
        } else if (firstChar.matches("^[0-9]")){
            return handleNumericTagging(firstChar, firstCharTag);
        }

        return new String[]{};
    }

    private String[] handleNumericTagging(String firstChar, String firstCharTag) {
        String twoDigitMatch;
        if(firstChar.matches("^[0-1]")) {
            twoDigitMatch = TAG_PREFIX + "0-1";
        } else if(firstChar.matches("^[2-3]")) {
            twoDigitMatch = TAG_PREFIX + "2-3";
        } else if(firstChar.matches("^[4-5]")) {
            twoDigitMatch = TAG_PREFIX + "4-5";
        } else if(firstChar.matches("^[6-7]")) {
            twoDigitMatch = TAG_PREFIX + "6-7";
        } else {
            twoDigitMatch = TAG_PREFIX + "8-9";
        }
        return new String[]{firstCharTag, twoDigitMatch, TAG_PREFIX + "0-9"};
    }

    @Modified
    @Activate
    protected void activate(final VendorServiceConfig vendorServiceConfig) {
        this.rootPagePath = vendorServiceConfig.rootPagePath();
        this.importAPI = vendorServiceConfig.importAPI();
        this.contentFragmentPath = vendorServiceConfig.contentFragmentPath();
    }

    private static final String TAG_PREFIX = "vendor-alpha-group:";
    private static final Logger log = LoggerFactory.getLogger(VendorServiceAPIImpl.class);

}

package com.tdscore.core.services.impl;

import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.Rendition;
import com.day.cq.i18n.I18n;
import com.day.cq.wcm.api.Page;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tdscore.core.services.ReactFormTranslationService;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.ResourceBundle;
import java.util.concurrent.ConcurrentHashMap;

@Component(service = ReactFormTranslationService.class, immediate = true)
public class ReactFormTranslationServiceImpl implements ReactFormTranslationService {

    @Override
    public String prepareTranslatedForm(Resource formResource, Page currentPage, SlingHttpServletRequest request) {
        String jsonData = StringUtils.EMPTY;
        if (formResource != null) {
            Asset asset = formResource.adaptTo(Asset.class);
            if (asset != null) {
                Rendition original = asset.getOriginal();
                if (original != null) {
                    InputStream inputStream = original.getStream();
                    ObjectMapper mapper = new ObjectMapper();
                    try {
                        ConcurrentHashMap<String, Object> jsonMap =
                                mapper.readValue(inputStream, ConcurrentHashMap.class);
                        localiseTranslationValue(jsonMap, currentPage, request);
                        jsonData = new ObjectMapper().writeValueAsString(jsonMap);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        return jsonData;
    }

    private void localiseTranslationValue(ConcurrentHashMap<String, Object> jsonMap, Page currentPage, SlingHttpServletRequest request) {
        I18n i18n = getI18n(currentPage, request);
        for (String key : jsonMap.keySet()) {
            // if(key.endsWith("_i18n")) // commented this : use this when the attributes are eligible for i18n is implemented
            // the JSON will have _i18n added to attributes that are eligible for translation
            //  example : formTitle_i18n or invalidPatternMsg_i18n
            Object value = jsonMap.get(key);
            if (value instanceof String) {
                String transVal = i18n.get(value + "");
                if (!transVal.equals(value + "")) {
                    jsonMap.put(key, transVal);
                }
            }
//          }
        }
    }

    private I18n getI18n(Page currentPage, SlingHttpServletRequest request) {
        Locale pageLang = currentPage.getLanguage();
        ResourceBundle resourceBundle = request.getResourceBundle(pageLang);
        return new I18n(resourceBundle);
    }

}

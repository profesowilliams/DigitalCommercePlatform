package com.tdscore.core.services;

import com.day.cq.wcm.api.Page;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;

public interface ReactFormTranslationService {
    String prepareTranslatedForm(Resource formResource, Page currentPage, SlingHttpServletRequest request);
}

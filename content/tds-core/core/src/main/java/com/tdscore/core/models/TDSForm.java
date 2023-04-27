package com.tdscore.core.models;

import com.day.cq.wcm.api.Page;
import com.tdscore.core.services.ReactFormTranslationService;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;

import javax.annotation.PostConstruct;

@Getter
@Setter
@Model(adaptables = {SlingHttpServletRequest.class, Resource.class},
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TDSForm {

    public static final String RESOURCE_TYPE = "tds-core/components/tds-form/v1/tds-form";
    private String jsonData;

    @Self
    private SlingHttpServletRequest request;

    @ScriptVariable
    private Page currentPage;

    @OSGiService
    private ReactFormTranslationService formTranslationService;

    @PostConstruct
    protected void init() {
        Resource resource = request.getResource();
        ValueMap properties = resource.adaptTo(ValueMap.class);
        String jsonPath = properties.get("json", StringUtils.EMPTY);

        if(StringUtils.isNotEmpty(jsonPath)) {
            Resource jsonDAMResource = request.getResourceResolver().getResource(jsonPath);
            jsonData = formTranslationService.prepareTranslatedForm(jsonDAMResource, currentPage, request);
        }
    }

}

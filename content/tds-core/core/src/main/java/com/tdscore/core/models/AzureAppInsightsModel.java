package com.tdscore.core.models;

import javax.annotation.PostConstruct;

import com.tdscore.core.config.AzureAppInsightsConfiguration;


import com.tdscore.core.services.AzureAppInsights;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import lombok.Getter;

@Getter
@Model(adaptables = SlingHttpServletRequest.class)
public class AzureAppInsightsModel {

    @OSGiService
    private AzureAppInsights azureAppInsightsService;

    private String appInsightsSdkLocation;
    private String cookieDomain;
    private String[] coorelationHeaderExcludedDomains;
    private boolean enableAjaxErrorStatusText;
    private boolean enableAjaxPerfTracking;
    private boolean enableApplicationInsights;
    private boolean enableCorsCorrelation;
    private String instrumentationKey;

    @PostConstruct
    protected void init() {
        final AzureAppInsightsConfiguration config = azureAppInsightsService.getConfig();
        this.appInsightsSdkLocation = config.getAppInsightsSdkLocation();
        this.cookieDomain = config.getCookieDomain();
        this.coorelationHeaderExcludedDomains = config.getCoorelationHeaderExcludedDomains();
        this.enableAjaxErrorStatusText = config.getEnableAjaxErrorStatusText();
        this.enableAjaxPerfTracking = config.getEnableAjaxPerfTracking();
        this.enableApplicationInsights = config.getEnableApplicationInsights();
        this.enableCorsCorrelation = config.getEnableCorsCorrelation();
        this.instrumentationKey = config.getInstrumentationKey();
    }
}

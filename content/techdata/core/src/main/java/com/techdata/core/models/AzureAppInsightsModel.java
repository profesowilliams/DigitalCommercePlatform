package com.techdata.core.models;

import javax.annotation.PostConstruct;

import com.day.cq.wcm.api.Page;
import com.techdata.core.slingcaconfig.AzureAppInsightsConfiguration;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.caconfig.ConfigurationBuilder;
import org.apache.sling.models.annotations.Model;

import lombok.Getter;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;

@Getter
@Model(adaptables = SlingHttpServletRequest.class)
public class AzureAppInsightsModel {

    @ScriptVariable
    private Page currentPage;

    private String appInsightsSdkLocation;
    private String cookieDomain;
    private String[] correlationHeaderExcludedDomains;
    private boolean enableAjaxErrorStatusText;
    private boolean enableAjaxPerfTracking;
    private boolean enableApplicationInsights;
    private boolean enableCorsCorrelation;
    private String instrumentationKey;

    @PostConstruct
    protected void init() {
        AzureAppInsightsConfiguration config =
                currentPage.adaptTo(ConfigurationBuilder.class).as(AzureAppInsightsConfiguration.class);
        this.appInsightsSdkLocation = config.getAppInsightsSdkLocation();
        this.cookieDomain = config.getCookieDomain();
        this.correlationHeaderExcludedDomains = config.getCorrelationHeaderExcludedDomains();
        this.enableAjaxErrorStatusText = config.getEnableAjaxErrorStatusText();
        this.enableAjaxPerfTracking = config.getEnableAjaxPerfTracking();
        this.enableApplicationInsights = config.getEnableApplicationInsights();
        this.enableCorsCorrelation = config.getEnableCorsCorrelation();
        this.instrumentationKey = config.getInstrumentationKey();
    }
}
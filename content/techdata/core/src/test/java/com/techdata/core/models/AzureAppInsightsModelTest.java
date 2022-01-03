package com.techdata.core.models;

import com.techdata.core.config.AzureAppInsightsConfiguration;
import com.techdata.core.services.AzureAppInsights;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class AzureAppInsightsModelTest {
    @InjectMocks
    AzureAppInsightsModel azureAppInsightsModel;

    @Mock
    AzureAppInsights azureAppInsightsService;

    @Mock
    AzureAppInsightsConfiguration insightsConfiguration;

    String[] coorelation = new String[]{"techdata","aem"};

    @Test
    void testInit(){
        when(azureAppInsightsService.getConfig()).thenReturn(insightsConfiguration);
        when(insightsConfiguration.getAppInsightsSdkLocation()).thenReturn("/content");
        when(insightsConfiguration.getCookieDomain()).thenReturn("cookies");
        when(insightsConfiguration.getEnableApplicationInsights()).thenReturn(true);
        when(insightsConfiguration.getInstrumentationKey()).thenReturn("appinsight");
        when(insightsConfiguration.getEnableAjaxErrorStatusText()).thenReturn(true);
        when(insightsConfiguration.getEnableCorsCorrelation()).thenReturn(true);
        when(insightsConfiguration.getCoorelationHeaderExcludedDomains()).thenReturn(coorelation);
        when(insightsConfiguration.getEnableAjaxPerfTracking()).thenReturn(true);
        azureAppInsightsModel.init();
    }
    @Test
    void testappInsightsSdkLocation(){
        azureAppInsightsModel.getAppInsightsSdkLocation();
    }
    @Test
    void testcookieDomain(){
        azureAppInsightsModel.getCookieDomain();
    }
    @Test
    void testcoorelationHeaderExcludedDomains(){
        azureAppInsightsModel.getCoorelationHeaderExcludedDomains();
    }
    @Test
    void testinstrumentationKey(){
        azureAppInsightsModel.getInstrumentationKey();
    }
    @Test
    void testenableAjaxErrorStatusText(){
        azureAppInsightsModel.isEnableAjaxErrorStatusText();
    }
    @Test
    void testenableAjaxPerfTracking(){
        azureAppInsightsModel.isEnableAjaxPerfTracking();
    }
    @Test
    void testenableApplicationInsights(){
        azureAppInsightsModel.isEnableApplicationInsights();
    }
    @Test
    void testenableCorsCorrelation(){
        azureAppInsightsModel.isEnableCorsCorrelation();
    }
}

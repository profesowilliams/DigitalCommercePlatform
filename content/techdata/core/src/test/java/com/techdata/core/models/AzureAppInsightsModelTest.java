package com.techdata.core.models;

import com.day.cq.wcm.api.Page;
import com.techdata.core.slingcaconfig.AzureAppInsightsConfiguration;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.caconfig.ConfigurationBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;

import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class AzureAppInsightsModelTest {
    @InjectMocks
    AzureAppInsightsModel azureAppInsightsModel;

    @Mock
    private Page currentPage;

    @Mock
    AzureAppInsightsConfiguration insightsConfiguration;

    @Mock
    private ConfigurationBuilder configurationBuilder;

    String[] coorelation = new String[]{"tdscore","aem"};

    @BeforeEach
    void setUp() {
        azureAppInsightsModel = new AzureAppInsightsModel();

        Field pageField = null;
        try {
            pageField = azureAppInsightsModel.getClass().getDeclaredField("currentPage");
            pageField.setAccessible(true);
            pageField.set(azureAppInsightsModel, currentPage);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }
    }


    @Test
    void testInit(){
        when(currentPage.adaptTo(ConfigurationBuilder.class)).thenReturn(configurationBuilder);
        when(configurationBuilder.as(AzureAppInsightsConfiguration.class)).thenReturn(insightsConfiguration);
        when(insightsConfiguration.getAppInsightsSdkLocation()).thenReturn("/content");
        when(insightsConfiguration.getCookieDomain()).thenReturn("cookies");
        when(insightsConfiguration.getEnableApplicationInsights()).thenReturn(true);
        when(insightsConfiguration.getInstrumentationKey()).thenReturn("appinsight");
        when(insightsConfiguration.getEnableAjaxErrorStatusText()).thenReturn(true);
        when(insightsConfiguration.getEnableCorsCorrelation()).thenReturn(true);
        when(insightsConfiguration.getCorrelationHeaderExcludedDomains()).thenReturn(coorelation);
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
        azureAppInsightsModel.getCorrelationHeaderExcludedDomains();
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

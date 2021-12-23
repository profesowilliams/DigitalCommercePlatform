package com.techdata.core.services.impl;

import com.techdata.core.config.AzureAppInsightsConfiguration;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class AzureAppInsightsImplTest {
    @InjectMocks
    AzureAppInsightsImpl azureAppInsights;
    @Mock
    AzureAppInsightsConfiguration config;
    @Test
    void testActive(){
        azureAppInsights.activate(config);
    }
    @Test
    void testConfig(){
        azureAppInsights.getConfig();
    }
}

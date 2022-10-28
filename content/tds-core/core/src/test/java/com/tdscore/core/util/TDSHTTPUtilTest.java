package com.tdscore.core.util;

import org.apache.http.client.config.RequestConfig;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.osgi.services.HttpClientBuilderFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class})
class TDSHTTPUtilTest {

    @InjectMocks
    TDSHTTPUtil underTest;

    @Mock
    private HttpClientBuilderFactory httpClientBuilderFactory;

    @Mock
    private HttpClientBuilder httpClientBuilder;

    @Mock
    RequestConfig requestConfig;

    @BeforeEach
    void setUp() {
    }

    @Test
    void buildHttpClient() {
        when(httpClientBuilderFactory.newBuilder()).thenReturn(httpClientBuilder);
        underTest.buildHttpClient(httpClientBuilderFactory, 2000, 2000);
        verify(httpClientBuilder, Mockito.times(1)).build();

    }
}
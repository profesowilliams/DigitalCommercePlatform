package com.tdscore.core.services.impl;

import com.tdscore.core.services.IntouchRequest;
import com.tdscore.core.util.TDSHTTPUtil;
import junitx.util.PrivateAccessor;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.osgi.services.HttpClientBuilderFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;

import static com.tdscore.core.services.impl.IntouchRetrieveDataServiceImpl.CONNECTION_TIMEOUT_IN_MILLIS;
import static com.tdscore.core.services.impl.IntouchRetrieveDataServiceImpl.SOCKET_TIMEOUT_IN_MILLIS;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith({MockitoExtension.class})
class IntouchRetrieveDataServiceImplTest {

    @InjectMocks
    IntouchRetrieveDataServiceImpl underTest;

    @Mock
    private HttpClientBuilderFactory httpClientBuilderFactory;

    @Mock
    private TDSHTTPUtil httpUtil;

    @Mock
    private CloseableHttpClient httpClient;

    @Mock
    private CloseableHttpResponse httpResponse;

    @Mock
    private HttpEntity httpEntity;

    @BeforeEach
    void setUp() throws NoSuchFieldException {
        PrivateAccessor.setField(underTest, "httpUtil", httpUtil);
        PrivateAccessor.setField(underTest, "httpClientBuilderFactory", httpClientBuilderFactory);
    }

    @Test
    void fetchScriptsDataTest() throws IOException {
        IntouchRequest intouchRequest =
                new IntouchRequest(1234567, API_URL, SITE, ACCEPT_LANGUAGE_EN_US);
        Mockito.lenient().when(httpUtil.buildHttpClient(httpClientBuilderFactory,
                CONNECTION_TIMEOUT_IN_MILLIS, SOCKET_TIMEOUT_IN_MILLIS)).thenReturn(httpClient);
        Mockito.lenient().when(httpClient.execute(any())).thenReturn(httpResponse);
        Mockito.lenient().when(httpResponse.getEntity()).thenReturn(httpEntity);
        underTest.fetchScriptsData(intouchRequest);
        verify(httpResponse, times(1)).getEntity();

    }

    final static String API_URL = "test-api-url";
    final static String SITE = "uk";
    final static String ACCEPT_LANGUAGE_EN_US = "en-us";
    final static String RESPONSE_JSON_STRING = "{\"name\":\"John\", \"age\":30, \"car\":null}";
}
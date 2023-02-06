package com.tdscore.core.services.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tdscore.core.services.IntouchRequest;
import com.tdscore.core.services.IntouchRetrieveDataService;
import com.tdscore.core.util.TDSHTTPUtil;
import org.apache.commons.lang.StringUtils;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.osgi.services.HttpClientBuilderFactory;
import org.apache.http.util.EntityUtils;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

import static acscommons.com.google.common.net.HttpHeaders.CONTENT_TYPE;
import static com.tdscore.core.services.IntouchRequestType.CSS_REQUEST;
import static com.tdscore.core.services.IntouchRequestType.JS_REQUEST;
import static org.apache.http.entity.ContentType.APPLICATION_JSON;

@Component(service = IntouchRetrieveDataService.class, immediate = true)
public class IntouchRetrieveDataServiceImpl implements IntouchRetrieveDataService {

    @SuppressWarnings("java:S2440")
    private final transient TDSHTTPUtil httpUtil = new TDSHTTPUtil();

    @Reference
    private transient HttpClientBuilderFactory httpClientBuilderFactory;

    @Override
    public String fetchScriptsData(IntouchRequest intouchRequest) {
        if(intouchRequest.getRequestId() == CSS_REQUEST.getId() ||
           intouchRequest.getRequestId() == JS_REQUEST.getId()) {
            CloseableHttpClient httpClient =
                    httpUtil.buildHttpClient(httpClientBuilderFactory, CONNECTION_TIMEOUT_IN_MILLIS, SOCKET_TIMEOUT_IN_MILLIS);
            try {
                return callAPI(httpClient, intouchRequest);
            } catch (Exception e) {
                LOGGER.error("Exception occurred during intouch request call", e);
            }
        }
        return StringUtils.EMPTY;
    }

    private String callAPI(CloseableHttpClient httpClient, IntouchRequest request) throws IOException {
        HttpGet httpGet = new HttpGet(request.getApiUrl());
        httpGet.setHeader(CONTENT_TYPE, APPLICATION_JSON.getMimeType());
        httpGet.setHeader(ACCEPT_LANGUAGE_LABEL, request.getAcceptLanguage());
        httpGet.setHeader(SITE_LABEL, request.getSite());
        if(httpClient != null) {
            CloseableHttpResponse httpResponse = httpClient.execute(httpGet);
            return EntityUtils.toString(httpResponse.getEntity());
        }
        return StringUtils.EMPTY;
    }

    public static final int CONNECTION_TIMEOUT_IN_MILLIS = 30000;
    public static final int SOCKET_TIMEOUT_IN_MILLIS = 30000;
    public static final String ACCEPT_LANGUAGE_LABEL = "Accept-Language";
    public static final String SITE_LABEL = "Site";
    private static final Logger LOGGER = LoggerFactory.getLogger(IntouchRetrieveDataServiceImpl.class);

}

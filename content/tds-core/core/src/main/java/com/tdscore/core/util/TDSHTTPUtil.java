package com.tdscore.core.util;

import org.apache.http.client.config.RequestConfig;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.osgi.services.HttpClientBuilderFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class TDSHTTPUtil {

    /**
     * Default constructor
     */
    public TDSHTTPUtil(){}

    /**
     * Build the HttpClient object for given httpClient factory with connection/socket timeouts
     *
     * @param httpClientBuilderFactory - httpclient factory
     * @param connectionTimeoutInMillis - connection timeout
     * @param socketTimeoutInMillis - socket timeout
     * @return - HttpClient
     */
    public CloseableHttpClient buildHttpClient(HttpClientBuilderFactory httpClientBuilderFactory,
                                               int connectionTimeoutInMillis, int socketTimeoutInMillis) {
        HttpClientBuilder httpClientBuilder = httpClientBuilderFactory.newBuilder();
        RequestConfig requestConfig = RequestConfig.custom()
                .setConnectTimeout(connectionTimeoutInMillis)
                .setSocketTimeout(socketTimeoutInMillis)
                .build();
        httpClientBuilder.setDefaultRequestConfig(requestConfig);
        return httpClientBuilder.build();
    }

    private static final Logger LOGGER = LoggerFactory.getLogger(TDSHTTPUtil.class);

}

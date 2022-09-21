package com.tdscore.core.util;

import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.osgi.services.HttpClientBuilderFactory;
import org.apache.sling.api.SlingHttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;


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

    /**
     * Prepare Http object with url and httpMethod(POST/PUT)
     * @param userId - userId used to build the resultant URL
     * @param httpMethod - PUT/POST HTTP methods
     * @param oktaAPI - API url
     * @return - returns corresponding Http object
     */
    public Object prepareHTTPObject(String userId, String httpMethod, String oktaAPI) {
        String oktaAuthUrl = oktaAPI + userId;

        LOGGER.debug("Okta Auth API Url= {}", oktaAuthUrl);
        if(httpMethod.equals("POST")) {
            return new HttpPost(oktaAuthUrl);
        } else if(httpMethod.equals("PUT")) {
            return new HttpPut(oktaAuthUrl);
        }
        return null;
    }

    public String getBody(SlingHttpServletRequest request) throws IOException {

        StringBuilder stringBuilder = new StringBuilder();
        InputStream inputStream = request.getInputStream();
        if (inputStream != null) {
            try(BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));) {
                char[] charBuffer = new char[128];
                int bytesRead;
                while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
                    stringBuilder.append(charBuffer, 0, bytesRead);
                }
            } catch(Exception e) {
                LOGGER.error("Exception occurred during the file reading", e);
            }
        }

        return stringBuilder.toString();

    }

    private static final Logger LOGGER = LoggerFactory.getLogger(TDSHTTPUtil.class);

}

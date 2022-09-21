package com.tdscore.core.services;

public class IntouchRequest {
    private int requestId;
    private String apiUrl;
    private String site;
    private String acceptLanguage;

    public IntouchRequest(int requestId, String apiUrl, String site, String acceptLanguage) {
        this.requestId = requestId;
        this.apiUrl = apiUrl;
        this.site = site;
        this.acceptLanguage = acceptLanguage;
    }

    public int getRequestId() {
        return requestId;
    }

    public void setRequestId(int requestId) {
        this.requestId = requestId;
    }

    public String getApiUrl() {
        return apiUrl;
    }

    public void setApiUrl(String apiUrl) {
        this.apiUrl = apiUrl;
    }

    public String getSite() {
        return site;
    }

    public void setSite(String site) {
        this.site = site;
    }

    public String getAcceptLanguage() {
        return acceptLanguage;
    }

    public void setAcceptLanguage(String acceptLanguage) {
        this.acceptLanguage = acceptLanguage;
    }
}

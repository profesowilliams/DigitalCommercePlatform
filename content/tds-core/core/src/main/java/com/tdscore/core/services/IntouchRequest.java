package com.tdscore.core.services;

public class IntouchRequest {
    private int requestId;
    private String apiUrl;

    public IntouchRequest(int requestId, String apiUrl) {
        this.requestId = requestId;
        this.apiUrl = apiUrl;
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
}

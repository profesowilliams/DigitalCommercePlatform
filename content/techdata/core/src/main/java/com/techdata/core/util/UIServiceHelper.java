package com.techdata.core.util;

import com.google.gson.JsonObject;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.annotation.versioning.ProviderType;

@ProviderType
public interface UIServiceHelper {
    JsonObject getUIServiceJSONResponse(String uiServiceEndpoint, String sessionID);
    JsonObject getVendorDataFromAEM(String path, ResourceResolver resolver);
}

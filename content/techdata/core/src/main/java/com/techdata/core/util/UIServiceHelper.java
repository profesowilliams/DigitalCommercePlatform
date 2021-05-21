package com.techdata.core.util;

import org.osgi.annotation.versioning.ProviderType;
import com.google.gson.*;

@ProviderType
public interface UIServiceHelper {
    JsonObject getUIServiceJSONResponse(String UIServiceEndpoint, String sessionID);
}

package com.techdata.core.util.impl;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.techdata.core.util.UIServiceHelper;
import org.apache.commons.lang3.StringUtils;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

@Component(service = UIServiceHelper.class)
public class UIServiceHelperImpl implements  UIServiceHelper {
    protected static final Logger log = LoggerFactory.getLogger(UIServiceHelperImpl.class);

    @Override
    public JsonObject getUIServiceJSONResponse(String uiServiceEndpoint, String sessionID) {
        log.debug("Endpoint {}, session ID {}", uiServiceEndpoint, sessionID);
        String jsonData = StringUtils.EMPTY;

        URL url = null;
        try {
            url = new URL(uiServiceEndpoint);

            HttpURLConnection conn = null;
            conn = (HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(5 * 1000);
            conn.setReadTimeout(5 * 1000);
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");
            conn.setRequestProperty("TraceId", "35345345-Browse");
            conn.setRequestProperty("Site", "NA");
            conn.setRequestProperty("Consumer", "NA");
            conn.setRequestProperty("Accept-Language", "en-us");
            conn.setRequestProperty("sessionid", sessionID);
            if (conn.getResponseCode() != 200) {
                throw new UIServiceException("Failed : HTTP error code : " + conn.getResponseCode());
            }
            BufferedReader br = new BufferedReader(new InputStreamReader((conn.getInputStream())));
            String output;
            StringBuilder myJSON = new StringBuilder();
            while ((output = br.readLine()) != null) {
                myJSON.append(output);
            }
            br.close();

            jsonData = myJSON.toString();

        } catch (IOException e) {
            e.printStackTrace();
        }

        JsonElement jsonElement = new JsonParser().parse(jsonData);
        return jsonElement.getAsJsonObject();
    }
}

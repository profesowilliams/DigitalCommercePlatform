package com.techdata.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.google.gson.*;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Iterator;

@Model(adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
@Setter
public class LinkItem {

    protected static final Logger log = LoggerFactory.getLogger(LinkItem.class);

    @Inject
    private String platformName;

    @Inject
    private String linkUrl;

    @Inject
    private boolean enableUIServiceEndPoint;

    @Inject
    private String iconUrl;

    @Inject
    private String navigationRoot;

    @Inject
    private String linkTarget;

    @Inject
    private String enableSecondaryIcon;

    @Inject
    private ResourceResolver resolver;

    @Inject
    private String UIServiceEndPoint;

    @Inject
    private String externalUrl;

    @Inject
    private String sessionID;


    List<SubNavLinks> subLinks = new ArrayList<>();
    private List<SubNavLinks> tertiarySubNavLinks = new ArrayList<>();

    @PostConstruct
    protected void init(){
        if(resolver != null && navigationRoot != null && !enableUIServiceEndPoint){
            Page rootPage = resolver.adaptTo(PageManager.class).getPage(navigationRoot);
            if(rootPage != null){
                Iterator<Page> children = rootPage.listChildren();
                while(children.hasNext()){
                    Page childPage = children.next();
                    Resource pageResource = childPage.getContentResource();
                    SubNavLinks link = new SubNavLinks(childPage, resolver, platformName);
                    subLinks.add(link);
                    for(SubNavLinks tertiaryLink : link.getSubNavLinkslist())
                    {
                        this.tertiarySubNavLinks.add(tertiaryLink);
                    }
                }

            }
        } else if(enableUIServiceEndPoint){

            try {
                URL url = new URL(UIServiceEndPoint);
                HttpURLConnection conn = null;
                conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Accept", "application/json");
                conn.setRequestProperty("TraceId", "35345345-Browse");
                conn.setRequestProperty("Site", "NA");
                conn.setRequestProperty("Consumer", "NA");
                conn.setRequestProperty("Accept-Language", "en-us");
                conn.setRequestProperty("sessionid", sessionID);
                if (conn.getResponseCode() != 200) {
                    throw new RuntimeException("Failed : HTTP error code : " + conn.getResponseCode());
                }
                BufferedReader br = new BufferedReader(new InputStreamReader((conn.getInputStream())));
                String output;
                StringBuilder myJSON = new StringBuilder();
                while ((output = br.readLine()) != null) {
                    myJSON.append(output);
                }
                br.close();

                String jsonData = myJSON.toString();
                if (StringUtils.isNotBlank(jsonData)) {
                    JsonElement jsonElement = new JsonParser().parse(jsonData);
                    JsonObject jobject = jsonElement.getAsJsonObject();
                    JsonElement responseData = jobject.get("content").getAsJsonObject().get("items");

                    JsonArray jsonArray = (JsonArray) responseData.getAsJsonArray().get(0).getAsJsonObject().get("children");
                    Iterator<JsonElement> elements = jsonArray.iterator();
                    while (elements.hasNext()) {
                        JsonElement recordElement = elements.next();
                        String name = recordElement.getAsJsonObject().get("name").toString().replace("\"", "");
                        String pageUrl = externalUrl+recordElement.getAsJsonObject().get("key").toString();
                        SubNavLinks link = new SubNavLinks(name, pageUrl, platformName);
                        subLinks.add(link);
                    }

                }
                Gson gson = new GsonBuilder().create();


            } catch (IOException e) {
                e.printStackTrace();
            }

        }

    }

    public String getPlatformMenuID(){
        return this.getPlatformName().toLowerCase(Locale.ROOT);
    }

    public List<SubNavLinks> getSecondaryMenuItems() {
        return this.subLinks;
    }

    public boolean getHasSecondaryMenuItems() {
        return this.subLinks!=null && this.subLinks.size() > 0;
    }


    public List<SubNavLinks> getTertiaryMenuItems(){
        return this.tertiarySubNavLinks;
    }
}

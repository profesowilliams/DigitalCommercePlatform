package com.tdscore.core.models;

import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.Rendition;
import com.day.cq.wcm.api.LanguageManager;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageFilter;
import com.day.cq.wcm.api.PageManager;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.*;

public class LanguageDropDownItem  {

    protected static final Logger log = LoggerFactory.getLogger(LanguageDropDownItem.class);

    private Page page;
    private boolean active;
    private String title;
    private String svgFlag;
    private String languagePageUrl;
//    This needs to be configurable. Due to time constraints, this will be hard-coded
    private static final  String DAM_TECHDATA_COUNTRY_FLAGS = "/content/dam/tds-core/country-flags";

    private List<LanguageDropDownItem> children;

    public String getTitle(){
        return this.title;
    }

    public String getSvgFlag() {
        return this.svgFlag;
    }

    private String initSVGFlag(Page page)
    {  
        if (page.getName().length() >= 0) {
            Resource assetResource = page.getContentResource().getResourceResolver().getResource(String.format("%s/%s.svg", DAM_TECHDATA_COUNTRY_FLAGS, page.getName()));
            if (assetResource != null) {
                Asset asset = assetResource.adaptTo(Asset.class);
                return getBinary(asset);
            } else {
                return StringUtils.EMPTY;
            }
        }else{
            return StringUtils.EMPTY;
        }

    }

    // This needs to be externalized as a util method
    public String getBinary(Asset asset) {
        if (Objects.nonNull(asset)) {
            final Rendition rendition = asset.getOriginal();
            final InputStream stream = rendition.getStream();
            return readXml(stream);
        }
        return StringUtils.EMPTY;
    }
// This needs to be externalized as a util method
    private String readXml(final InputStream content) {
        String readLine;
        final BufferedReader br = new BufferedReader(new InputStreamReader(content));
        final StringBuilder strBuilder = new StringBuilder();

        try {
            while (((readLine = br.readLine()) != null)) {
                strBuilder.append(readLine);
            }
        } catch (IOException e) {
            log.error("Unable to read the SVG's XML from InputStream: ", e);
        }
        return strBuilder.toString();
    }
    LanguageDropDownItem(Page page, boolean active) {
        this.page = page;
        this.active = active;
        this.title = page.getPageTitle();
        this.svgFlag = initSVGFlag(page);
    }

    LanguageDropDownItem(Page page, boolean active, int level) {
        List<LanguageDropDownItem> childPages = new ArrayList<>();
        this.page = page;
        this.active = active;
        this.title = page.getPageTitle();
        this.svgFlag = initSVGFlag(page);

        Iterator<Page> it = page.listChildren(new PageFilter());
        if(it != null) {
            while (it.hasNext()) {
                Page nextPage = it.next();
                if (level - 1 > 0) {
                    childPages.add(new LanguageDropDownItem(nextPage, active, level - 1));
                } else {
                    childPages.add(new LanguageDropDownItem(nextPage, active));
                }
            }
        }
        this.children = childPages;
        if(!children.isEmpty()) {
            this.languagePageUrl = children.get(0).getURL();
        }
    }

    public String getLanguagePageUrl() {
        return languagePageUrl;
    }

    public void setActive(boolean active)
    {
        this.active = active;
    }

    public boolean getActive()
    {
        return this.active;
    }

    public String getLanguageDisplayText()
    {
        return this.page.getLanguage().getDisplayLanguage() + " - " + this.page.getLanguage().getLanguage().toUpperCase();
    }

    public Page getPage()
    {
        return this.page;
    }

    public String getURL()
    {
        return this.page.getPath() + ".html";
    }

    public String getLanguage() {
        return this.page.getLanguage().getLanguage();
    }

    public String getDisplayLanguage() {
        return this.page.getLanguage().getDisplayLanguage();
    }

    @SuppressWarnings("squid:S2384")
    public List<LanguageDropDownItem> getChildren() {
        return children;
    }

}

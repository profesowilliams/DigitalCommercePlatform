package com.techdata.core.models;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.factory.ModelFactory;

import com.adobe.cq.wcm.core.components.models.LanguageNavigation;
import com.adobe.cq.wcm.core.components.models.NavigationItem;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Style;

@Model(adaptables = SlingHttpServletRequest.class,
       resourceType = {LanguageNavigationImpl.RESOURCE_TYPE})
public class LanguageNavigationImpl {

    public static final String RESOURCE_TYPE = "techdata/components/languagenavigation";

    @Self
    private SlingHttpServletRequest request;
    
    @ScriptVariable
    private Page currentPage;

    @ScriptVariable
    private ValueMap properties;

    @ScriptVariable
    private Style currentStyle;

    private String navigationRoot;
    private int structureDepth;
    Resource rootPage;
   
    private int startLevel;
    
    @Inject
    List<NavigationItem> items;
    
    //@OSGiService
    //ModelFactory modelFactory;
    
    //LanguageNavigation languageNavigationModel;

    @PostConstruct
    private void initModel() {
    	this.navigationRoot = (String)this.properties.get("navigationRoot", this.currentStyle.get("navigationRoot", String.class));
        this.structureDepth = ((Integer)this.properties.get("structureDepth", this.currentStyle.get("structureDepth", Integer.valueOf(1)))).intValue();
         //languageNavigationModel=modelFactory.getModelFromWrappedRequest(request, request.getResource(), com.adobe.cq.wcm.core.components.models.LanguageNavigation.class);
        rootPage=request.getResourceResolver().getResource(navigationRoot);
    }
    
    public String getLocalePageTitle() {
   	 return currentPage.getAbsoluteParent(rootPage.adaptTo(Page.class).getDepth() ).getTitle().toUpperCase();
   }
    
    public List<NavigationItem> getTest() {
    	List<NavigationItem> newList=new  ArrayList<NavigationItem>();
    	for(NavigationItem item:items) {
    		if(item.getPath().contains("/"+currentPage.getAbsoluteParent(rootPage.adaptTo(Page.class).getDepth() ).getName()+"/")) {
    			newList.addAll(item.getChildren());
    		}
    		}
    	
    	return newList;
    }
   
}

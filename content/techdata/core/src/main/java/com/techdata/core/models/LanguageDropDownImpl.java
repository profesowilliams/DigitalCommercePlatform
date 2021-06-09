package com.techdata.core.models;

import com.adobe.cq.wcm.core.components.models.LanguageNavigation;
import com.adobe.cq.wcm.core.components.models.NavigationItem;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.designer.Style;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;

import org.apache.sling.models.annotations.via.ResourceSuperType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;

@Model(adaptables = SlingHttpServletRequest.class, adapters = LanguageNavigation.class, resourceType = LanguageDropDownImpl.RESOURCE_TYPE)
public class LanguageDropDownImpl implements LanguageNavigation {

	protected static final Logger log = LoggerFactory.getLogger(LanguageDropDownImpl.class);

	public static final String RESOURCE_TYPE = "techdata/components/languagenavigation";
	private static final String DEFAULT_NAVIGATION_ROOT = "/content";

	@Self
	private SlingHttpServletRequest request;

	private String navigationRoot;
	private String structureDepth;

	@Self
	@Via(type = ResourceSuperType.class)
	LanguageNavigation delegateLanguageNavigation;

	@ScriptVariable
	private Page currentPage;

	@ScriptVariable
	private ValueMap properties;

	@ScriptVariable
	private Style currentStyle;

	private List<NavigationItem> items;

	@PostConstruct
	private void initModel() {
		navigationRoot = properties.get(PN_NAVIGATION_ROOT, currentStyle.get(PN_NAVIGATION_ROOT, String.class));
		structureDepth = properties.get(PN_STRUCTURE_DEPTH, currentStyle.get(PN_STRUCTURE_DEPTH, String.class));

		items = delegateLanguageNavigation.getItems();
	}

	private int getCountryPageDepthFromCurrentPage() {
		PageManager pageManager = currentPage.getPageManager();
		log.debug("navigation depth is {}, structure depth is {}", pageManager.getPage(navigationRoot).getDepth(), Integer.valueOf(structureDepth));
		return (currentPage.getDepth() > pageManager.getPage(navigationRoot).getDepth() + Integer.valueOf(structureDepth) ? currentPage.getDepth() - (pageManager.getPage(navigationRoot).getDepth() + Integer.valueOf(structureDepth) ) + 1 : 0);
	}

	public List<NavigationItem> getActiveLanguageItems(){

		PageManager pageManager = currentPage.getPageManager();
		List<NavigationItem> languageItems = new ArrayList<>();
		log.debug("navigation root is {}", navigationRoot);

		for(NavigationItem navigationItem: items)
		{
			log.debug("inside item path {}", navigationItem.getPath());
			if (navigationItem.isActive())
			{

				languageItems = navigationItem.getChildren();
			}
		}
		return items;
	}

	@Override
	public List<NavigationItem> getItems()
	{
		return items;
	}

	public String getNavigationRoot() {
		return navigationRoot;
	}
	
	public String getCountryRootPageTitle() {
		return currentPage.getParent(getCountryPageDepthFromCurrentPage()).getPageTitle();
	}
}

package com.techdata.core.models;


import com.adobe.cq.wcm.core.components.models.LanguageNavigation;
import com.adobe.cq.wcm.core.components.models.NavigationItem;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageFilter;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.designer.Style;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;

import org.apache.sling.models.annotations.via.ResourceSuperType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Model(adaptables = SlingHttpServletRequest.class, adapters = LanguageNavigation.class, resourceType = LanguageDropDownImpl.RESOURCE_TYPE)
public class LanguageDropDownImpl implements LanguageNavigation {

	protected static final Logger log = LoggerFactory.getLogger(LanguageDropDownImpl.class);

	public static final String RESOURCE_TYPE = "techdata/components/languagenavigation";
	private static final String DEFAULT_NAVIGATION_ROOT = "/content";
//	how many levels below nav root
	private static final int COUNTRY_ROOT_OFFSET = 2;
//	how many levels below nav root
	private static final int REGION_ROOT_OFFSET = 0;


	@Self
	private SlingHttpServletRequest request;

	private String navigationRoot;
	private int structureDepth;

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
	private List<NavigationItem> countryItems;




	@PostConstruct
	private void initModel() {
		navigationRoot = properties.get(PN_NAVIGATION_ROOT, currentStyle.get(PN_NAVIGATION_ROOT, String.class));
		structureDepth = properties.get(PN_STRUCTURE_DEPTH, currentStyle.get(PN_STRUCTURE_DEPTH, 1));

		items = delegateLanguageNavigation.getItems();
	}

	public List<LanguageDropDownItem> getRegionListItems() {
		List<LanguageDropDownItem> test = getDropDownItems(currentPage.getParent(getRegionRootPageDepthFromCurrentPage()), true);
		return test;
	}

	private List<LanguageDropDownItem> getDropDownItems(Page root, boolean getChildren) {

		List<LanguageDropDownItem> pages = new ArrayList<>();
		if (root.getDepth() >= currentPage.getPageManager().getPage(navigationRoot).getDepth()) {
			Iterator<Page> it = root.listChildren(new PageFilter());
			while (it.hasNext()) {

				Page page = it.next();
				boolean active = currentPage.getPath().equals(page.getPath()) || currentPage.getPath().startsWith(page.getPath() + "/");
				if (getChildren)
				{
					pages.add(new LanguageDropDownItem(page, active, 3));
				}else{
					pages.add(new LanguageDropDownItem(page, active));
				}

			}
		}

		return pages;
	}

	public List<LanguageDropDownItem> getLanguageListItems() {
		return getDropDownItems(currentPage.getParent(getCountryPageDepthFromCurrentPage()), false);
	}

	private int getCountryPageDepthFromCurrentPage() {
		PageManager pageManager = currentPage.getPageManager();
		return (currentPage.getDepth() > pageManager.getPage(navigationRoot).getDepth() ? currentPage.getDepth() - (pageManager.getPage(navigationRoot).getDepth()) - COUNTRY_ROOT_OFFSET : 0);
	}

	private int getRegionRootPageDepthFromCurrentPage() {
		PageManager pageManager = currentPage.getPageManager();
		return (currentPage.getDepth() > pageManager.getPage(navigationRoot).getDepth() ? currentPage.getDepth() - (pageManager.getPage(navigationRoot).getDepth()) - REGION_ROOT_OFFSET : 0);
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

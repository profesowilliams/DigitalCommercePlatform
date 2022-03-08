package com.techdata.core.models;

import com.adobe.cq.wcm.core.components.models.LanguageNavigation;
import com.adobe.cq.wcm.core.components.models.NavigationItem;
import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageFilter;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.designer.Style;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.via.ResourceSuperType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Model(
	adaptables = {SlingHttpServletRequest.class},
	adapters = LanguageNavigation.class,
	resourceType = LanguageDropDownModel.RESOURCE_TYPE,
	defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class LanguageDropDownModel implements LanguageNavigation {

	protected static final Logger log = LoggerFactory.getLogger(LanguageDropDownModel.class);

	public static final String RESOURCE_TYPE = "techdata/components/languagenavigation";
	//	how many levels below nav root
	private static final int COUNTRY_ROOT_OFFSET = 2;
	//	how many levels below nav root
	private static final int REGION_ROOT_OFFSET = 0;

	private static final String NAV_TITLE = "navTitle";
	private static final String PAGE_TITLE = "pageTitle";

	@Self
	private SlingHttpServletRequest request;

	private String navigationRoot;

	@Self
	@Via(type = ResourceSuperType.class)
	LanguageNavigation delegateLanguageNavigation;

	@ScriptVariable
	private Page currentPage;

	@ScriptVariable
	private ValueMap properties;

	@ScriptVariable
	private Style currentStyle;

	@Getter
	@ValueMapValue
	private boolean icon;

	@Inject @Via("resource")
	private String overRideCurrentPage;


	private List<NavigationItem> items;

	@PostConstruct
	private void initModel() {
		navigationRoot = properties.get(PN_NAVIGATION_ROOT, currentStyle.get(PN_NAVIGATION_ROOT, String.class));
		items = delegateLanguageNavigation.getItems();
		if (overRideCurrentPage != null)
		{
			currentPage = currentPage.getPageManager().getPage(this.overRideCurrentPage);
		}
	}

	public List<LanguageDropDownItem> getRegionListItems() {
		return getDropDownItems(currentPage.getParent(getRegionRootPageDepthFromCurrentPage()), Boolean.TRUE);
	}

	private List<LanguageDropDownItem> getDropDownItems(Page root, boolean getChildren) {

		List<LanguageDropDownItem> pages = new ArrayList<>();
		if (root != null && root.getDepth() >= currentPage.getPageManager().getPage(navigationRoot).getDepth()) {
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
		int depth = currentPage.getDepth() - pageManager.getPage(navigationRoot).getDepth() - COUNTRY_ROOT_OFFSET;
		return (currentPage.getDepth() > pageManager.getPage(navigationRoot).getDepth()) ? depth : 0;
	}

	private int getRegionRootPageDepthFromCurrentPage() {
		PageManager pageManager = currentPage.getPageManager();
		int depth = currentPage.getDepth() - pageManager.getPage(navigationRoot).getDepth() - REGION_ROOT_OFFSET;
		return currentPage.getDepth() > pageManager.getPage(navigationRoot).getDepth() ? depth : 0;
	}

	@SuppressWarnings("squid:S2384")
	@Override
	public List<NavigationItem> getItems()
	{
		return items;
	}

	public String getNavigationRoot() {
		return navigationRoot;
	}
	
	public String getCountryRootPageTitle() {
		Page page = currentPage.getParent(getCountryPageDepthFromCurrentPage());
		String title = StringUtils.EMPTY;
		if(page != null){
			ValueMap properties = page.getProperties();
			if(properties.containsKey(NAV_TITLE)){
				title = properties.get(NAV_TITLE, String.class);
			} else if (properties.containsKey(PAGE_TITLE)){
				title = properties.get(PAGE_TITLE, String.class);
			} else {
				title = properties.get(JcrConstants.JCR_TITLE, String.class);
			}
		}
		return title;
	}

	public String getOverRideCurrentPage(){
		return this.overRideCurrentPage;
	}
}

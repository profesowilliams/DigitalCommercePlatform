/**
 *
 */
package com.techdata.core.models;

import com.day.cq.wcm.api.Page;
import com.techdata.core.slingcaconfig.AnalyticsConfiguration;
import com.techdata.core.slingcaconfig.MiniCartConfiguration;
import com.techdata.core.slingcaconfig.ServiceEndPointsConfiguration;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.caconfig.ConfigurationBuilder;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;

import javax.annotation.PostConstruct;


@Model(adaptables= {SlingHttpServletRequest.class,Resource.class})
public class CaConfigReader {

	@ScriptVariable(name = "currentPage")
	private Page page;

	private String uiServiceDomain;

	private String catalogEndpoint;

	private String authorizationPageURL;

	private String loginEndpoint;

	private String pingAppId;

	private String activeCartEndpoint;

	private String myConfigurationsEndpoint;

	private String myOrdersEndpoint;

	private String myQuotesEndpoint;

	private String myDealsEndpoint;

	private String myRenewalsEndpoint;

	private String topItemsEndpoint;

	private String createQuoteEndpoint;

	private String cartDetailsEndpoint;

	private String pricingConditionsEndPoint;

	private String estimatedIdListEndpoint;

	private String estimatedIdDetailsEndpoint;

	private String savedCartsEndpoint;

	private String quoteGridEndpoint;

	private String quoteDetailEndpoint;

	private String orderGridEndpoint;

	private String vendorConnectionEndpoint;

	private  String shopDomain;

	private String cartURL;

	private String tdPartSmart;

	private String analyticsSnippet;

	@PostConstruct
	public void init() {
		ServiceEndPointsConfiguration serviceEndPointsConfiguration =
				page.adaptTo(ConfigurationBuilder.class).as(ServiceEndPointsConfiguration.class);
		MiniCartConfiguration mcConfiguration =  page.adaptTo(ConfigurationBuilder.class).as(MiniCartConfiguration.class);
		AnalyticsConfiguration analyticsConfiguration =  page.adaptTo(ConfigurationBuilder.class).as(AnalyticsConfiguration.class);
		uiServiceDomain =  serviceEndPointsConfiguration.uiServiceDomain();
		catalogEndpoint = serviceEndPointsConfiguration.catalogEndpoint();
		authorizationPageURL = serviceEndPointsConfiguration.authorizationPageURL();
		loginEndpoint = serviceEndPointsConfiguration.loginEndpoint();
		pingAppId =  serviceEndPointsConfiguration.pingAppId();
		activeCartEndpoint = serviceEndPointsConfiguration.activeCartEndpoint();
		myConfigurationsEndpoint = serviceEndPointsConfiguration.myConfigurationsEndpoint();
		myOrdersEndpoint = serviceEndPointsConfiguration.myOrdersEndpoint();
		myQuotesEndpoint = serviceEndPointsConfiguration.myQuotesEndpoint();
		myDealsEndpoint = serviceEndPointsConfiguration.myDealsEndpoint();
		myRenewalsEndpoint = serviceEndPointsConfiguration.myRenewalsEndpoint();
		topItemsEndpoint = serviceEndPointsConfiguration.topItemsEndpoint();
		createQuoteEndpoint = serviceEndPointsConfiguration.createQuoteEndpoint();
		cartDetailsEndpoint = serviceEndPointsConfiguration.cartDetailsEndpoint();
		pricingConditionsEndPoint = serviceEndPointsConfiguration.pricingConditionsEndPoint();
		estimatedIdListEndpoint = serviceEndPointsConfiguration.estimatedIdListEndpoint();
		estimatedIdDetailsEndpoint = serviceEndPointsConfiguration.estimatedIdDetailsEndpoint();
		savedCartsEndpoint = serviceEndPointsConfiguration.savedCartsEndpoint();
		quoteGridEndpoint = serviceEndPointsConfiguration.quoteGridEndpoint();
		quoteDetailEndpoint = serviceEndPointsConfiguration.quoteDetailEndpoint();
		vendorConnectionEndpoint = serviceEndPointsConfiguration.vendorConnectionEndpoint();
		orderGridEndpoint = serviceEndPointsConfiguration.orderGridEndpoint();
		shopDomain = mcConfiguration.shopDomain();
		cartURL = mcConfiguration.cartURL();
		tdPartSmart = mcConfiguration.tdPartSmart();
		analyticsSnippet = analyticsConfiguration.analyticsSnippet();
	}

	public String getUiServiceDomain() {
		return uiServiceDomain;
	}

	public String getCatalogEndpoint() {
		return catalogEndpoint;
	}

	public String getAuthorizationPageURL() {
		return authorizationPageURL;
	}

	public String getLoginEndpoint() {
		return loginEndpoint;
	}

	public String getPingAppId() {
		return pingAppId;
	}

	public String getActiveCartEndpoint() {
		return activeCartEndpoint;
	}

	public String getMyConfigurationsEndpoint() {
		return myConfigurationsEndpoint;
	}

	public String getMyOrdersEndpoint() {
		return myOrdersEndpoint;
	}

	public String getMyQuotesEndpoint() {
		return myQuotesEndpoint;
	}

	public String getMyDealsEndpoint() {
		return myDealsEndpoint;
	}

	public String getMyRenewalsEndpoint() {
		return myRenewalsEndpoint;
	}

	public String getTopItemsEndpoint() {
		return topItemsEndpoint;
	}

	public String getCreateQuoteEndpoint() {
		return createQuoteEndpoint;
	}

	public String getCartDetailsEndpoint() {
		return cartDetailsEndpoint;
	}

	public String getPricingConditionsEndPoint() {
		return pricingConditionsEndPoint;
	}

	public String getEstimatedIdListEndpoint() {
		return estimatedIdListEndpoint;
	}

	public String getEstimatedIdDetailsEndpoint() {
		return estimatedIdDetailsEndpoint;
	}

	public String getSavedCartsEndpoint() {
		return savedCartsEndpoint;
	}

	public String getQuoteGridEndpoint() {
		return quoteGridEndpoint;
	}

	public String getQuoteDetailEndpoint() {
		return quoteDetailEndpoint;
	}

	public String getVendorConnectionEndpoint() {
		return vendorConnectionEndpoint;
	}

	public String getOrderGridEndpoint() {
		return orderGridEndpoint;
	}

	public String getShopDomain() {
		return shopDomain;
	}

	public String getCartURL() {
		return cartURL;
	}

	public String getTdPartSmart() {
		return tdPartSmart;
	}

	public String getAnalyticsSnippet() {
		return analyticsSnippet;
	}

}
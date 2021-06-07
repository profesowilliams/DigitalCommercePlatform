/**
 *
 */
package com.techdata.core.models;

import java.util.Arrays;

import javax.annotation.PostConstruct;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.caconfig.ConfigurationBuilder;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;

import com.techdata.core.slingcaconfig.ServiceEndPointsConfiguration;

import com.techdata.core.slingcaconfig.MiniCartConfiguration;


@Model(adaptables= {SlingHttpServletRequest.class,Resource.class})
public class CaConfigReader {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	private ServiceEndPointsConfiguration serviceEndPointsConfiguration = null;

	private MiniCartConfiguration mcConfiguration = null;

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

	private String topConfigurationsEndpoint;

	private String topQuotesEndpoint;

	private String cartDetailsEndpoint;

	private String savedCartsEndpoint;

	private String quoteGridEndpoint;

	private String orderGridEndpoint;

	private  String shopDomain;

	private String cartURL;

	private String tdPartSmart;


	@PostConstruct
	public void init() {
		serviceEndPointsConfiguration =  page.adaptTo(ConfigurationBuilder.class).as(ServiceEndPointsConfiguration.class);
		mcConfiguration =  page.adaptTo(ConfigurationBuilder.class).as(MiniCartConfiguration.class);
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
		topConfigurationsEndpoint = serviceEndPointsConfiguration.topConfigurationsEndpoint();
		topQuotesEndpoint = serviceEndPointsConfiguration.topQuotesEndpoint();
		cartDetailsEndpoint = serviceEndPointsConfiguration.cartDetailsEndpoint();
		savedCartsEndpoint = serviceEndPointsConfiguration.savedCartsEndpoint();
		quoteGridEndpoint = serviceEndPointsConfiguration.quoteGridEndpoint();
		orderGridEndpoint = serviceEndPointsConfiguration.orderGridEndpoint();
		shopDomain = mcConfiguration.shopDomain();
		cartURL = mcConfiguration.cartURL();
		tdPartSmart = mcConfiguration.tdPartSmart();
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

	public String getTopConfigurationsEndpoint() {
		return topConfigurationsEndpoint;
	}

	public String getTopQuotesEndpoint() {
		return topQuotesEndpoint;
	}

	public String getCartDetailsEndpoint() {
		return cartDetailsEndpoint;
	}

	public String getSavedCartsEndpoint() {
		return savedCartsEndpoint;
	}

	public String getQuoteGridEndpoint() {
		return quoteGridEndpoint;
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


}

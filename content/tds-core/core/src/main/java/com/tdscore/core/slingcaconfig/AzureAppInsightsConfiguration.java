package com.tdscore.core.slingcaconfig;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

@Configuration(
		label = "TDS Core Azure Application Insight Configuration",
		description = "This configuration reads the configurations necessary for Azure AppInsights connection.")
public @interface AzureAppInsightsConfiguration {

	@Property(
			label = "App Insights SDK Location")
	public String getAppInsightsSdkLocation();

    @Property(
			label = "Cookie Domain")
	public String getCookieDomain();

    @Property(
			label = "Correlation Header Excluded Domains")
	public String[] getCorrelationHeaderExcludedDomains();

    @Property(
			label = "Enable Ajax Error Status Text")
	public boolean getEnableAjaxErrorStatusText();

    @Property(
			label = "Enable AJAX Performance Tracking")
	public boolean getEnableAjaxPerfTracking();

    @Property(
			label = "Enable Application Insights")
	public boolean getEnableApplicationInsights();

    @Property(
			label = "Enable CORS Correlation")
	public boolean getEnableCorsCorrelation();

    @Property(
			label = "Instrumentation Key")
	public String getInstrumentationKey();
}
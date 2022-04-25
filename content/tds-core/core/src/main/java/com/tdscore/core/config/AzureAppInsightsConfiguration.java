package com.tdscore.core.config;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(
		name = "Azure Application Insight Configuration", 
		description = "This configuration reads the configurations necessary for Azure AppInsights connection.")
public @interface AzureAppInsightsConfiguration {

	@AttributeDefinition(
			name = "App Insights SDK Location", 
			type = AttributeType.STRING)
	public String getAppInsightsSdkLocation();

    @AttributeDefinition(
			name = "Cookie Domain", 
			type = AttributeType.STRING)
	public String getCookieDomain();

    @AttributeDefinition(
			name = "Correlation Header Excluded Domains", 
			type = AttributeType.STRING)
	public String[] getCoorelationHeaderExcludedDomains();

    @AttributeDefinition(
			name = "Enable Ajax Error Status Text", 
			type = AttributeType.BOOLEAN)
	public boolean getEnableAjaxErrorStatusText();

    @AttributeDefinition(
			name = "Enable AJAX Performance Tracking", 
			type = AttributeType.BOOLEAN)
	public boolean getEnableAjaxPerfTracking();

    @AttributeDefinition(
			name = "Enable Application Insights", 
			type = AttributeType.BOOLEAN)
	public boolean getEnableApplicationInsights();

    @AttributeDefinition(
			name = "Enable CORS Correlation", 
			type = AttributeType.BOOLEAN)
	public boolean getEnableCorsCorrelation();

    @AttributeDefinition(
			name = "Instrumentation Key", 
			type = AttributeType.STRING)
	public String getInstrumentationKey();
}
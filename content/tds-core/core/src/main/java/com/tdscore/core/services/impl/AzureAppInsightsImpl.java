package com.tdscore.core.services.impl;


import com.tdscore.core.config.AzureAppInsightsConfiguration;
import com.tdscore.core.services.AzureAppInsights;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;


@Component(service = AzureAppInsights.class, immediate = true)
@Designate(ocd = AzureAppInsightsConfiguration.class)
public class AzureAppInsightsImpl implements AzureAppInsights {

	private AzureAppInsightsConfiguration config;

	@Activate
	protected void activate(AzureAppInsightsConfiguration config) {
		this.config = config;
	}

	@Override
	public AzureAppInsightsConfiguration getConfig() {
		return config;
	}
}

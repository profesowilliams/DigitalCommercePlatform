package com.techdata.digitalCommerce.core.services;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@Designate(ocd = DigitalCommerceAPIConfiguration.Config.class)
@Component(immediate = true, service = DigitalCommerceAPIConfiguration.class, enabled = true)

public class DigitalCommerceAPIConfiguration {

	@ObjectClassDefinition(name = "Digital Commerce API Configuration" , description = "Digital Commerce API Configuration")
	public static @interface Config {

		@AttributeDefinition(name = "Product API" , description = "Provide Product API URL")
		String productAPI(); // Default Value = http://usdevmtap04/CustomerService/api/ediCustomer/product
	}
	private String productAPI;


	public String getProductApiUrl() {
		return productAPI;
	}

	@Activate
	protected void activate(final Config config)
	{		
		productAPI = config.productAPI();
	}
}

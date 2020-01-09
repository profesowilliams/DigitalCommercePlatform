package com.techdata.digitalCommerce.core.services;



import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Designate(ocd = LoginApiUrlConfiguration.Config.class)
@Component(immediate = true, service = LoginApiUrlConfiguration.class, enabled = true)
public class LoginApiUrlConfiguration {

	private static final Logger LOGGER = LoggerFactory.getLogger(LoginApiUrlConfiguration.class);

	@ObjectClassDefinition(name = "Login API Configuration Setting" , description = "Login API configuration setting")
	public static @interface Config{

		@AttributeDefinition(name = "secretKey" , description = "Provide secret key for encryption and decryption")
		String secretKey(); // Default Value = boooooooooom!!!!

		@AttributeDefinition(name = "salt" , description = "Provide salt for encryption and decryption")
		String salt(); // Default Value = ssshhhhhhhhhhh!!!!

		@AttributeDefinition(name = "api url" , description = "Provide API URL")
		String apiUrl(); // Default Value = http://usdevmtap04/CustomerService/api/customerService/getuserInformation?token=3245345345345345
	}

	private String apiUrl;
	private String salt;
	private String secretKey;

	public String getApiUrl() {
		return apiUrl;
	}

	public String getSalt() {
		return salt;
	}

	public String getSecretKey() {
		return secretKey;
	}

	@Activate
	protected void activate(final Config config)
	{

		secretKey = config.secretKey();
		salt = config.salt();
		apiUrl = config.apiUrl();

		LOGGER.info("Secret Key : " + config.secretKey());
		LOGGER.info("Salt : " + config.salt());
		LOGGER.info("API URL : " + config.apiUrl());
	}


}

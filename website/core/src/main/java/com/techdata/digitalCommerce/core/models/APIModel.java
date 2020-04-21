package com.techdata.digitalCommerce.core.models;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.servlet.http.Cookie;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.RequestAttribute;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techdata.digitalCommerce.core.constants.Constants;
import com.techdata.digitalCommerce.core.services.DigitalCommerceAPIConfiguration;
import com.techdata.digitalCommerce.core.services.LoginApiUrlConfiguration;
import com.techdata.digitalCommerce.core.utilities.Cryptography;
import com.techdata.digitalCommerce.core.utilities.URLConnection;


@Model(adaptables=SlingHttpServletRequest.class)
public class APIModel {
	private Logger LOG = LoggerFactory.getLogger(APIModel.class);

	@RequestAttribute
	private String apiURL;

	@RequestAttribute
	@Optional
	private String jsonInput;

	@RequestAttribute
	@Optional
	private String requestVariable;

	@RequestAttribute
	private String method;

	@SlingObject
	private SlingHttpServletRequest httpServletRequest;

	@SlingObject
	private SlingHttpServletResponse httpServletResponse;

	@Inject
	LoginApiUrlConfiguration urlConfig;
	
	@Inject
	DigitalCommerceAPIConfiguration digitalCommerceAPIConfiguration;

	URLConnection urlConnection = new URLConnection();
	Cryptography cryptography = new Cryptography();

	String encryptedString;
	HttpURLConnection con ;
	Cookie td_session_cookie =null ;
	Cookie td_lwp_cookie=null;

	private Map<String, Object> jsonMap;

	public Map<String, Object> getJsonMap() {
		return jsonMap;
	}

	@SuppressWarnings("unchecked")
	@PostConstruct
	protected void init() {
		LOG.error("Inside APIModel");
		LOG.error("apiURL " + getApiURL());
		LOG.error("apiURL from Configuration " + digitalCommerceAPIConfiguration.getProductApiUrl());

		ObjectMapper mapper = new ObjectMapper();
		td_session_cookie =  getHttpServletRequest().getCookie(Constants.TD_SESSION_COOKIE_NAME);
		
		String productId = getHttpServletRequest().getParameter("productId");

		try {

			if(productId!=null)
			{
				if(digitalCommerceAPIConfiguration.getProductApiUrl() != null) {
					setApiURL(digitalCommerceAPIConfiguration.getProductApiUrl());
				}
				con = urlConnection.conn(getApiURL()+"?productId="+productId, td_session_cookie.getValue(), getMethod());
			}
			else
			{
				con = urlConnection.conn(getApiURL(), td_session_cookie.getValue(), getMethod());
			}

			if(jsonInput != null && "POST".equals(getMethod())) { 
				con.setDoOutput(true);
				LOG.error("OUTPUT Stream");

				try(OutputStream os = con.getOutputStream()){ 
					byte[] input = jsonInput.getBytes("utf-8"); 
					os.write(input, 0, input.length); 
				} 
			}
			 

			int code = con.getResponseCode();
			LOG.error("code " + code);

			InputStream inputStream = con.getInputStream();
			LOG.error("con.getInputStream()" +con.getInputStream());
			LOG.error("Hello CF");
			setJsonMap(mapper.readValue(inputStream, Map.class));
				LOG.error("jsonMap" +getJsonMap());
			getHttpServletRequest().setAttribute(getRequestVariable(), getJsonMap());

			con.disconnect();
		
		}
		catch (Exception e) {
			System.out.println("Error while Encryption Decryption : " + e.toString());
		}
		
	}

	public SlingHttpServletRequest getHttpServletRequest() {
		return httpServletRequest;
	}

	public void setHttpServletRequest(SlingHttpServletRequest httpServletRequest) {
		this.httpServletRequest = httpServletRequest;
	}

	public String getApiURL() {
		return apiURL;
	}

	public void setApiURL(String apiURL) {
		this.apiURL = apiURL;
	}

	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		this.method = method;
	}

	public void setJsonMap(Map<String, Object> jsonMap) {
		this.jsonMap = jsonMap;
	}

	public String getRequestVariable() {
		return requestVariable;
	}

	public void setRequestVariable(String requestVariable) {
		this.requestVariable = requestVariable;
	}

	
}

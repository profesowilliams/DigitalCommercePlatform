package com.techdata.digitalCommerce.core.models;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techdata.digitalCommerce.core.constants.Constants;

@Model(adaptables=SlingHttpServletRequest.class)
public class NewsModel extends APIModel{
	
	@SuppressWarnings("unchecked")
	@PostConstruct
	protected void init() {
		
		td_session_cookie =  getHttpServletRequest().getCookie(Constants.TD_SESSION_COOKIE_NAME);
		ObjectMapper mapper = new ObjectMapper();
		
		String articleId = getHttpServletRequest().getParameter(Constants.QUERY_PARAM_ID);
		if(articleId!=null) {
			setApiURL(getApiURL().replace("{ID}",articleId));
		}
		
		con = urlConnection.conn(getApiURL(), td_session_cookie.getValue(), getMethod());
		try {
			
			InputStream inputStream = con.getInputStream();
			setJsonMap(mapper.readValue(inputStream, Map.class));
			
			getHttpServletRequest().setAttribute(getRequestVariable(), getJsonMap());
			con.disconnect();
			
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		
		
	}
}

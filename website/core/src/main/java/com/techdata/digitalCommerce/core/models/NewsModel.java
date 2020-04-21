package com.techdata.digitalCommerce.core.models;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techdata.digitalCommerce.core.constants.Constants;

@Model(adaptables=SlingHttpServletRequest.class)
public class NewsModel extends APIModel{
	private Logger LOG = LoggerFactory.getLogger(NewsModel.class);
	
	@Inject
	private Page currentPage;
	
	@SuppressWarnings("unchecked")
	@PostConstruct
	protected void init() {
		
		td_session_cookie =  getHttpServletRequest().getCookie(Constants.TD_SESSION_COOKIE_NAME);
		ObjectMapper mapper = new ObjectMapper();
		Page page = getHttpServletRequest().getResourceResolver().getResource(currentPage.getPath()).adaptTo(Page.class);
		if(page!=null) {
		String lang = page.getLanguage(true).getLanguage();
		String tmp = getApiURL().replace("/en/", "/"+lang+"/");
		
		if(urlConnection.conn(tmp, td_session_cookie.getValue(), getMethod())!=null) {
			setApiURL(tmp);
		}
		LOG.info(" lang : " + lang + " path : " + getApiURL() + " tmp : " + tmp);
		}
		
		String articleId = getHttpServletRequest().getParameter(Constants.QUERY_PARAM_ID);
		if(articleId!=null) {
			setApiURL(getApiURL().replace("{ID}",articleId));
		}
		LOG.info("api url : " + getApiURL());
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

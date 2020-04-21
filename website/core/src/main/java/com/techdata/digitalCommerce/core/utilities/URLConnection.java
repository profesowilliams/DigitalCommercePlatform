package com.techdata.digitalCommerce.core.utilities;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Base64;

public class URLConnection {
	URL url;
	HttpURLConnection con ;
	
	public HttpURLConnection conn(String ApiUrl, String td_session_cookie, String method)
	{
		try
		{
			url = new URL(ApiUrl);
			con = (HttpURLConnection) url.openConnection();
			con.addRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:25.0) Gecko/20100101 Firefox/25.0");
			con.addRequestProperty("td_session_cookie", td_session_cookie);		
			
			if("GET".equals(method)) 
				con.setRequestMethod("GET"); 
			else if("POST".equals(method)) 
				con.setRequestMethod("POST");
			
			String userPass= "admin" + ":" + "admin";
			String basicAuth = "Basic " + new String(Base64.getEncoder().encode(userPass.getBytes())) ;
			con.setRequestProperty("Authorization", basicAuth);

			con.setRequestProperty("Content-Type", "application/json; charset=utf-8");
			con.setRequestProperty("Accept", "application/json");
			con.setDoOutput(true);
		}
		catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} 
		
		return con;
	}
}

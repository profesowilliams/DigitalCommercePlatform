package com.techdata.digitalCommerce.core.utilities;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class URLConnection {
	
	URL url;
	HttpURLConnection con ;

	public HttpURLConnection conn(String ApiUrl, String td_session_cookie)
	{
		try
		{
			
			url = new URL(ApiUrl);
			con = (HttpURLConnection)url.openConnection();
			con.addRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:25.0) Gecko/20100101 Firefox/25.0");
			con.addRequestProperty("td_session_cookie", td_session_cookie);
			con.setRequestMethod("POST");
			con.setRequestProperty("Content-Type", "application/json; charset=utf-8");
			con.setRequestProperty("Accept", "application/json");
			con.setDoOutput(true);
		}
		catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		
		return con;
	}
}

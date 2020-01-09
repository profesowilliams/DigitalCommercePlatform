package com.techdata.digitalCommerce.core.models;


import com.techdata.digitalCommerce.core.constants.Constants;
import com.techdata.digitalCommerce.core.services.LoginApiUrlConfiguration;
import com.techdata.digitalCommerce.core.utilities.URLConnection;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

import javax.annotation.PostConstruct;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import javax.inject.Inject;
import javax.servlet.http.Cookie;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.models.annotations.Model;

import org.apache.sling.models.annotations.injectorspecific.SlingObject;

//import static com.techdata.digitalCommerce.core.constants.Constants.TD_SESSION_COOKIE_NAME;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.databind.ObjectMapper;

@Model(adaptables=SlingHttpServletRequest.class)
public class LoginModel {

	private Logger LOG = LoggerFactory.getLogger(LoginModel.class);

	Cookie td_session_cookie =null ;
	Cookie td_lwp_cookie=null;


	@SlingObject
	private SlingHttpServletRequest httpServletRequest;

	@SlingObject
	private SlingHttpServletResponse httpServletResponse;

	@Inject
	LoginApiUrlConfiguration urlConfig;

	String encryptedString;
	IvParameterSpec ivspec;
	SecretKeySpec secretKey;
	Cipher cipher;
	String jsonInput = "";
	HttpURLConnection con ;
	URLConnection urlConnection = new URLConnection();

	private Map<String, String> jsonMap;

	boolean isLoggedIn;

	public Map<String, String> getJsonMap() {
		return jsonMap;
	}

	public boolean isLoggedIn() {
		return isLoggedIn;
	}

	public void aes()
	{
		try
		{
			byte[] iv = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
			ivspec = new IvParameterSpec(iv);
			SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
			KeySpec spec = new PBEKeySpec(urlConfig.getSecretKey().toCharArray(), urlConfig.getSalt().getBytes(), 65536, 256);
			SecretKey tmp = factory.generateSecret(spec);
			secretKey = new SecretKeySpec(tmp.getEncoded(), "AES");
			cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
		}
		catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InvalidKeySpecException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (NoSuchPaddingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}	
	
	
	
	@SuppressWarnings("unchecked")
	@PostConstruct
	protected void init() {
		try {
			LOG.error("Inside POSTAPIDemoModel");
			LOG.error("apiURL " + urlConfig.getApiUrl());
			td_session_cookie =  httpServletRequest.getCookie(Constants.TD_SESSION_COOKIE_NAME);			
			ObjectMapper mapper = new ObjectMapper();

			//Check for Session Cookie
			if(td_session_cookie==null)
			{

				td_session_cookie = new Cookie("td_session",  UUID.randomUUID().toString()); 
				td_session_cookie.setMaxAge(3600);//change the scope to session
				td_session_cookie.setDomain(httpServletRequest.getServerName());
				httpServletResponse.addCookie(td_session_cookie);
			}

			//Check for Login Cookie
			td_lwp_cookie =  httpServletRequest.getCookie(Constants.TD_LWP_COOKIE_NAME);
			if(td_lwp_cookie!=null)
			{

				isLoggedIn=true;
				LOG.error("DECRYPTION");
				try {
					this.aes();
					cipher.init(Cipher.DECRYPT_MODE, secretKey, ivspec);
					String decryptedString =  new String(cipher.doFinal(Base64.getDecoder().decode(td_lwp_cookie.getValue())));
					LOG.error("Decrypted Message : "+decryptedString);				
					jsonMap = mapper.readValue(decryptedString, Map.class);
					LOG.error("Decryptred JSON : " + jsonMap);
				}
				catch (IOException e) 
				{
					e.printStackTrace();
				}
				catch (IllegalBlockSizeException e) 
				{
					e.printStackTrace();
				} 
				catch (BadPaddingException e) 
				{
					e.printStackTrace();
				}
			}
			else
			{
				isLoggedIn=false;

				try {			
					con =   urlConnection.conn(urlConfig.getApiUrl());
					try(OutputStream os = con.getOutputStream())
					{
						byte[] input = jsonInput.getBytes("utf-8");
						os.write(input, 0, input.length);			
					}
					int code = con.getResponseCode();
					LOG.error("code " + code);

					InputStream inputStream = con.getInputStream();

					jsonMap = mapper.readValue(inputStream, Map.class);
					LOG.error("Original JSON response " + jsonMap);
					String strToEncrypt=mapper.writeValueAsString(jsonMap);

					LOG.error("ENCRYPTION");
					this.aes();
					cipher.init(Cipher.ENCRYPT_MODE, secretKey, ivspec);
					encryptedString = Base64.getEncoder().encodeToString(cipher.doFinal(strToEncrypt.getBytes("UTF-8")));
					LOG.error("Encrypted String : "+encryptedString);
					td_lwp_cookie = new Cookie("td_lwp", encryptedString);
					td_lwp_cookie.setMaxAge(3600);
					td_lwp_cookie.setDomain(httpServletRequest.getServerName());
					httpServletResponse.addCookie(td_lwp_cookie);

					con.disconnect();

				}
				catch (Exception e) {
					System.out.println("Error while Encryption Decryption : " + e.toString());
				}
			}

		}
		catch (Exception e) {
			System.out.println("Error while Encryption Decryption : " + e.toString());
		}
	}
}

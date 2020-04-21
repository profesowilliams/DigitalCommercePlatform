package com.techdata.digitalCommerce.core.utilities;

import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.Base64;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Cryptography {
	
	private Logger LOG = LoggerFactory.getLogger(Cryptography.class);
	
	IvParameterSpec ivspec;
	SecretKeySpec secretKey;
	Cipher cipher;
	
	public String encryption(String strToEncrypt, String secretKeyFromConfig, String saltFromConfig) throws InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException, UnsupportedEncodingException {
		LOG.error("ENCRYPTION");
		aes(secretKeyFromConfig, secretKeyFromConfig);
		cipher.init(Cipher.ENCRYPT_MODE, secretKey, ivspec);
		String encryptedString = Base64.getEncoder().encodeToString(cipher.doFinal(strToEncrypt.getBytes("UTF-8")));
		return encryptedString;

	}

	public String decryption(String stringToDecrypt, String secretKeyFromConfig, String saltFromConfig) throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException {
		LOG.error("DECRYPTION");
		aes(secretKeyFromConfig, secretKeyFromConfig);
		cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
		cipher.init(Cipher.DECRYPT_MODE, secretKey, ivspec);
		String decryptedString =  new String(cipher.doFinal(Base64.getDecoder().decode(stringToDecrypt)));
		return decryptedString;
	}

	public void aes(String secretKeyFromConfig, String saltFromConfig)
	{
		try
		{
			byte[] iv = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
			ivspec = new IvParameterSpec(iv);
			SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
			KeySpec spec = new PBEKeySpec(secretKeyFromConfig.toCharArray(), saltFromConfig.getBytes(), 65536, 256);
			SecretKey tmp = factory.generateSecret(spec);
			secretKey = new SecretKeySpec(tmp.getEncoded(), "AES");
			cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
		}
		catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		} catch (InvalidKeySpecException e) {
			e.printStackTrace();
		} catch (NoSuchPaddingException e) {
			e.printStackTrace();
		}

	}
}

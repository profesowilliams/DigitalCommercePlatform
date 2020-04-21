package com.techdata.digitalCommerce.core.models;
public class NamelinkModel {
	public String name;
	public String link;
	public boolean isNewTabValue;

	public NamelinkModel(String name, String link,boolean isNewTabValue) {
		this.name = name;
		this.link = link;
		this.isNewTabValue= isNewTabValue;
	}
}
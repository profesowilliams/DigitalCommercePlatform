package com.techdata.core.models;

import java.util.Iterator;

import org.apache.commons.lang.StringUtils;

import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.wcm.core.components.models.ListItem;

public class FilmStripItem implements ListItem {
	private String imagePath;
	private String name;
	private String position;
	private String profileLink;

	public String getProfileLink() {
		return profileLink;
	}

	public String getImagePath() {
		return imagePath;
	}

	@Override
	public String getName() {
		return name;
	}

	public String getPosition() {
		return position;
	}
	
	public FilmStripItem(String imagePath, String name, String position, String profileLink) {
        this.imagePath = imagePath;
        this.name = name;
        this.position = position;
        this.profileLink = profileLink;
    }
	
	public static FilmStripItem getProfileListItem(ContentFragment cf, String profilePath){

        String imagePath = StringUtils.EMPTY;
        String name = StringUtils.EMPTY;
        String position = StringUtils.EMPTY;
        String profileLink = StringUtils.EMPTY;

        for (Iterator<ContentElement> it = cf.getElements(); it.hasNext(); ) {
            ContentElement ce = it.next();
            String tagElement = ce.getName();
            if(tagElement.equals("photo")){
            	imagePath = ce.getContent();
            }else if(tagElement.equals("name")){
            	name = ce.getContent();
            }else if(tagElement.equals("position")){
            	position = ce.getContent();
            }else if (profilePath != null){
            	profileLink = profilePath;
            }
        }
        return new FilmStripItem(imagePath, name, position, profileLink);
    }
}

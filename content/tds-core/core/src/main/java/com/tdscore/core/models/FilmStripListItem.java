package com.tdscore.core.models;

import java.util.Iterator;

import org.apache.commons.lang.StringUtils;

import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.wcm.core.components.models.ListItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FilmStripListItem implements ListItem {

    private static final Logger log = LoggerFactory.getLogger(FilmStripListItem.class);


    private static final String PN_PHOTO = "photo";
    private static final String PN_BIO = "bio";
    private static final String PN_POSITION = "title";
    private static final String PN_NAME = "name";



    private final String imagePath;
    private final String name;
    private final String position;
    private final String profileLink;
    private final String bio;

    public String getProfileLink() {

        return String.format("%s.html",profileLink);
    }

    public String getImagePath() {
        return imagePath;
    }

    @Override
    public String getName() {
        log.debug("getName called {}", name);
        return name;
    }

    public String getPosition() {
        return position;
    }

    public String getBio(){ return bio;}

    public FilmStripListItem(String imagePath, String name, String position, String profileLink, String bio) {
        log.debug("inside constructor, {}, {}, {}, {}", name, imagePath, position, bio);
        this.imagePath = imagePath;
        this.name = name;
        this.position = position;
        this.profileLink = profileLink;
        this.bio = bio;
    }

    public static FilmStripListItem getProfileListItem(ContentFragment cf, String profilePath){

        String imagePath = StringUtils.EMPTY;
        String name = StringUtils.EMPTY;
        String position = StringUtils.EMPTY;
        String bio = StringUtils.EMPTY;

        for (Iterator<ContentElement> it = cf.getElements(); it.hasNext(); ) {
            ContentElement ce = it.next();
            String tagElement = ce.getName();
            switch (tagElement) {
                case PN_PHOTO:
                    imagePath = ce.getContent();
                    break;
                case PN_NAME:
                    name = ce.getContent();
                    break;
                case PN_POSITION:
                    position = ce.getContent();
                    break;
                case PN_BIO:
                    bio = ce.getContent();
                    break;
                default:
                    log.warn("Unexpected tag element {}", tagElement);
                    break;
            }
        }
        return new FilmStripListItem(imagePath, name, position, profilePath, bio);
    }
}

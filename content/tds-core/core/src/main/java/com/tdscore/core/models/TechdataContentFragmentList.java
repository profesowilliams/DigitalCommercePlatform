package com.tdscore.core.models;

import com.adobe.cq.wcm.core.components.models.contentfragment.ContentFragmentList;
import com.adobe.cq.wcm.core.components.models.contentfragment.DAMContentFragment;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.via.ResourceSuperType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Model(adaptables = SlingHttpServletRequest.class, adapters = ContentFragmentList.class, resourceType = TechdataContentFragmentList.RESOURCE_TYPE)
public class TechdataContentFragmentList implements ContentFragmentList {

    private static final Logger log = LoggerFactory.getLogger(TechdataContentFragmentList.class);

    public static final String RESOURCE_TYPE = "tds-core/components/contentfragmentlist/v1/contentfragmentlist";

    @Self
    @Via(type = ResourceSuperType.class)
    ContentFragmentList delegateList;

    @Inject @Optional @Via("resource")
    boolean excludeRecentArticle;

    @Inject @Optional @Via("resource")
    Date recentArticleCutOffDate;

    @Override
    public Collection<DAMContentFragment> getListItems() {
        Collection<DAMContentFragment> cfListItems = delegateList.getListItems();
        log.debug("Content Fragment List Item Size  = {}", cfListItems.size());
        if(!excludeRecentArticle) {
            return cfListItems;
        } else {
            Collection<DAMContentFragment> listOfItems = new ArrayList<>();
            for (DAMContentFragment cfListItem : cfListItems) {
                if(elementIterator(cfListItem)) {
                    listOfItems.add(cfListItem);
                }
            }
            return listOfItems;
        }
    }

    public boolean elementIterator(DAMContentFragment cfListItem) {
        for (DAMContentFragment.DAMContentElement contentElement : cfListItem.getElements()) {
            String name = contentElement.getName();
            if ("press-release-date".equals(name)) {
                String date = convertDateToString((GregorianCalendar) contentElement.getValue());
                log.debug("press-release-date after format = {}", date);
                try {
                    return dateChecker(date);
                } catch (ParseException e) {
                    log.error("Error while parsing date");
                }
            }
        }
        return false;
    }

    public boolean dateChecker(String date) throws ParseException {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm.ss");
        if (recentArticleCutOffDate != null) {
            String newDate = formatter.format(recentArticleCutOffDate.getTime());
            Date cutOffDate = formatter.parse(newDate);
            Date elementDate = formatter.parse(date);
            int result = elementDate.compareTo(cutOffDate);
            return result < 0;
        }
        return false;
    }

    public String convertDateToString(GregorianCalendar date){
        String newDate = null;
        if (date != null) {
            DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm.ss");
            newDate = formatter.format(date.getTime());
        }
        log.debug("newDate = {}", newDate);
        return newDate;
    }
}
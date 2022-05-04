package com.tdscore.core.util;

import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import org.apache.sling.api.resource.Resource;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class ContentFragmentHelper {

    private ContentFragmentHelper(){}

    public static boolean isContentFragment(Resource resource)
    {
        ContentFragment cf = resource.adaptTo(ContentFragment.class);
        return cf != null;
    }

    public static Map<String, String> convertCFElementsToMap(ContentFragment cf)
    {
        Map<String, String> map = new HashMap<>();
        for (Iterator<ContentElement> it = cf.getElements(); it.hasNext(); ) {
            ContentElement ce = it.next();
            map.put(ce.getName(), ce.getContent());
        }

        return map;

    }
}

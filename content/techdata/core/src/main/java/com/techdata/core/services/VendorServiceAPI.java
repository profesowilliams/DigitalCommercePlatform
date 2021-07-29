package com.techdata.core.services;

import com.adobe.cq.dam.cfm.ContentFragmentException;
import com.day.cq.wcm.api.WCMException;
import org.apache.sling.api.resource.ResourceResolver;

import javax.jcr.RepositoryException;
import java.io.IOException;

public interface VendorServiceAPI {
    int fetchDataFromAPI(ResourceResolver resolver)
            throws RepositoryException, IOException, ContentFragmentException, WCMException;
}

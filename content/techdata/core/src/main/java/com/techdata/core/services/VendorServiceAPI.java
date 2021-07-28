package com.techdata.core.services;

import com.adobe.cq.dam.cfm.ContentFragmentException;
import com.day.cq.wcm.api.WCMException;
import org.apache.sling.api.resource.PersistenceException;
import org.apache.sling.api.resource.ResourceResolver;

import javax.jcr.RepositoryException;

public interface VendorServiceAPI {
    int fetchDataFromAPI(ResourceResolver resolver)
            throws RepositoryException, PersistenceException, ContentFragmentException, WCMException;
}

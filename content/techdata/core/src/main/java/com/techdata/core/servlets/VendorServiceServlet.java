package com.techdata.core.servlets;

import com.adobe.cq.dam.cfm.ContentFragmentException;
import com.day.cq.wcm.api.WCMException;
import com.techdata.core.services.VendorServiceAPI;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.jcr.RepositoryException;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;


@Component(
        immediate = true,
        service = Servlet.class,
        property = {
                "service.description=Vendor Service Servlet",
                "service.vendor=techdata.com",
                "sling.servlet.resourcetypes=techdata/components/xfpage",
                "sling.servlet.extensions=js",
                "sling.servlet.selectors=importvendors"
        }
)
public class VendorServiceServlet  extends SlingSafeMethodsServlet {

    @Reference
    private transient VendorServiceAPI vendorServiceAPI;

    @Override
    protected void doGet(SlingHttpServletRequest request,
                         SlingHttpServletResponse response) throws ServletException, IOException {
        int totalRecords = 0;
        try {
            totalRecords = vendorServiceAPI.fetchDataFromAPI(request.getResourceResolver());
        } catch (RepositoryException | ContentFragmentException | WCMException e) {
            e.printStackTrace();
        }
        response.getOutputStream().print("<h1>Imported " + totalRecords + " vendor records into AEM.</h1>");
    }
}

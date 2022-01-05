package com.techdata.core.servlets;

import com.day.cq.contentsync.handler.util.RequestResponseFactory;
import com.day.cq.wcm.api.WCMMode;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.engine.SlingRequestProcessor;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;

@Component(service=Servlet.class,
        property={
                "name=" + " Post to Get Redirect Servlet",
                Constants.SERVICE_DESCRIPTION + "= PostToGetRedirectServlet",
                "sling.servlet.methods=" + HttpConstants.METHOD_POST,
                "sling.servlet.resourceTypes="+ "sling/servlet/default",
                "sling.servlet.selectors="+ "post2get",
                "sling.servlet.extensions="+ "html"
        })
/**
 * Convert Post To Get, we can whitelist and black list paths later on
 */
public class PostToGetRedirectServlet extends SlingAllMethodsServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger log = LoggerFactory.getLogger(PostToGetRedirectServlet.class);

    @Reference
    private transient RequestResponseFactory requestResponseFactory;

    @Reference
    private transient SlingRequestProcessor slingRequestProcessor;

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        boolean doNotContinue = false;

        if (!StringUtils.isEmpty(request.getParameter(":formstart")) || (!StringUtils.isEmpty(request.getRequestPathInfo().getSelectorString()) && request.getRequestPathInfo().getSelectorString().equalsIgnoreCase("error"))) {
            doNotContinue = true;
        }

        if (doNotContinue) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            request.getResource();
            log.warn("{},This should not have happened. Path either contains a selector .html or the form post contains variable :formstart", request.getResource().getPath());
            return ;
        }
        String extension = request.getRequestPathInfo().getExtension();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        HttpServletRequest httpServletRequest =
                requestResponseFactory.createRequest(HttpConstants.METHOD_GET,request.getResource().getPath() + "."+ (StringUtils.isEmpty(extension) ? "html" : extension), new HashMap<>());
        WCMMode.DISABLED.toRequest(httpServletRequest);
        HttpServletResponse httpServletResponse = requestResponseFactory.createResponse(out);
        httpServletRequest.setAttribute("convertingPOSTtoGet","1");
        if (request.getParameterNames() != null) {
            Enumeration<String> enmParamNames = request.getParameterNames();
            while (enmParamNames.hasMoreElements()) {
                String paramName = enmParamNames.nextElement();
                if (request.getParameter(paramName) != null) {
                    httpServletRequest.setAttribute(paramName,request.getParameter(paramName));
                }
            }
        }
        slingRequestProcessor.processRequest(httpServletRequest,httpServletResponse,request.getResourceResolver());
        String html = out.toString();
        response.setContentType("text/html; charset=UTF-8");
        response.getWriter().write(html);
    }
}
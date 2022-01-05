package com.techdata.core.servlets;

import com.day.cq.contentsync.handler.util.RequestResponseFactory;
import com.day.cq.wcm.api.WCMMode;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestPathInfo;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.engine.SlingRequestProcessor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith({MockitoExtension.class})
class PostToGetRedirectServletTest {

    private PostToGetRedirectServlet underTest;

    @Mock
    private SlingHttpServletRequest request;

    @Mock
    private SlingHttpServletResponse response;

    @Mock
    private RequestPathInfo pathInfo;

    @Mock
    private Resource resource;

    @Mock
    private RequestResponseFactory requestResponseFactory;

    @Mock
    private SlingRequestProcessor slingRequestProcessor;

    @Mock
    private HttpServletResponse httpServletResponse;

    @Mock
    private HttpServletRequest httpServletRequest;

    @Mock
    private PrintWriter writer;

    @BeforeEach
    void setUp() {
        underTest = new PostToGetRedirectServlet();
        Field requestField = null;
        try {
            requestField = underTest.getClass().getDeclaredField("requestResponseFactory");
            requestField.setAccessible(true);
            requestField.set(underTest, requestResponseFactory);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }
        Field requestField2 = null;
        try {
            requestField = underTest.getClass().getDeclaredField("slingRequestProcessor");
            requestField.setAccessible(true);
            requestField.set(underTest, slingRequestProcessor);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
        }
    }

    @Test
    void testDoPost() throws ServletException, IOException {
        lenient().when(request.getParameter(":formstart")).thenReturn(null);
        lenient().when(request.getRequestPathInfo()).thenReturn(pathInfo);
        lenient().when(request.getResource()).thenReturn(resource);
        Mockito.lenient().when(requestResponseFactory.createRequest(any(), any(), any())).thenReturn(httpServletRequest);
        lenient().when(httpServletRequest.getAttribute(WCMMode.DISABLED.name())).thenReturn(WCMMode.DISABLED);
        lenient().when(requestResponseFactory.createResponse(any())).thenReturn(httpServletResponse);
        lenient().when(request.getParameterNames()).thenReturn(null);
        Mockito.lenient().doNothing().when(slingRequestProcessor).processRequest(any(), any(), any());
        Mockito.lenient().when((response.getWriter())).thenReturn(writer);
        underTest.doPost(request, response);
    }
}
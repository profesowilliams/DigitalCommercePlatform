package com.techdata.core.servlets;


import com.day.cq.wcm.api.Page;
import com.techdata.core.slingcaconfig.CommonConfigurations;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.caconfig.ConfigurationBuilder;
import org.apache.sling.hc.api.Result;
import org.apache.sling.hc.api.execution.HealthCheckExecutionOptions;
import org.apache.sling.hc.api.execution.HealthCheckExecutionResult;
import org.apache.sling.hc.api.execution.HealthCheckExecutor;
import org.apache.sling.hc.util.HealthCheckMetadata;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static junit.framework.Assert.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;


@ExtendWith({MockitoExtension.class})
class TechDataHealthCheckServletTest {
    private TechDataHealthCheckServlet underTest;

    @Mock
    HealthCheckExecutionResult her;

    @Mock
    HealthCheckMetadata hm;

    @Mock
    Result result;

    private Object Status;


    List<String> mockTags = new ArrayList<>();
    List<HealthCheckExecutionResult> mockList = new ArrayList<>();

    @Mock
    HealthCheckExecutor healthCheckExecutor;


    private final AemContext context = new AemContext(ResourceResolverType.RESOURCERESOLVER_MOCK);

    @BeforeEach
    void setUp() throws IllegalAccessException, NoSuchFieldException {

        underTest = new TechDataHealthCheckServlet();

        String mockTag = "mock tag";
        long mockElapsedTime = 1l;
        String mockHealthCheckMetadataName = "metadata string";
        String mockHealthCheckResultToString = "HC result string";
        String mockHealthCheckResultStatus = "HC result status";

        mockList.add(her);
        mockTags.add(mockTag);
        when(her.getHealthCheckMetadata()).thenReturn(hm);
        when(hm.getName()).thenReturn(mockHealthCheckMetadataName);
        when(her.getHealthCheckResult()).thenReturn(result);
        when(her.getElapsedTimeInMs()).thenReturn(mockElapsedTime);
        when(result.toString()).thenReturn(mockHealthCheckResultToString);
        when(result.getStatus()).thenReturn((Result.Status) this.Status);


        when(hm.getTags()).thenReturn(mockTags);

    }

    @Test
    void testGenerateResponse() throws InvocationTargetException, IllegalAccessException {





        Method underTestMethod;
        JSONObject resultJson = new JSONObject();



        try {
            underTestMethod = underTest.getClass().getDeclaredMethod("generateResponse", List.class, JSONObject.class);
            underTestMethod.setAccessible(true);
            assertNotNull(underTestMethod);

            List<HealthCheckExecutionResult> executionResults = new ArrayList<>();
            executionResults.add(her);

            underTestMethod.invoke(underTest, mockList, resultJson);
            assertNotNull(resultJson);

        } catch (NoSuchMethodException ignored) {
        }
    }

    @Test
    void testDoGet() throws InvocationTargetException, IllegalAccessException, NoSuchFieldException {

        Field healthCheckExecutorField = underTest.getClass().getDeclaredField("healthCheckExecutor");
        healthCheckExecutorField.setAccessible(true);
        healthCheckExecutorField.set(underTest, healthCheckExecutor);
        assertNotNull(healthCheckExecutorField);


        final String[] tags = { "security", "system", "bundles", "respository", "disk", "replication" };

        HealthCheckExecutionOptions options = new HealthCheckExecutionOptions();
        options.setCombineTagsWithOr(true);
        options.setForceInstantExecution(true);

        when(healthCheckExecutor.execute(options, tags)).thenReturn(mockList);
        when(result.isOk()).thenReturn(true);
        try {
            MockSlingHttpServletResponse mockResponse = context.response();
            underTest.doGet(context.request(), mockResponse);
            assertEquals(HttpServletResponse.SC_OK, mockResponse.getStatus());


        } catch (ServletException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Test
    void testDoGetError() throws InvocationTargetException, IllegalAccessException, NoSuchFieldException {

        Field healthCheckExecutorField = underTest.getClass().getDeclaredField("healthCheckExecutor");
        healthCheckExecutorField.setAccessible(true);
        healthCheckExecutorField.set(underTest, healthCheckExecutor);
        assertNotNull(healthCheckExecutorField);


        final String[] tags = { "security", "system", "bundles", "respository", "disk", "replication" };

        HealthCheckExecutionOptions options = new HealthCheckExecutionOptions();
        options.setCombineTagsWithOr(true);
        options.setForceInstantExecution(true);

        when(healthCheckExecutor.execute(options, tags)).thenReturn(mockList);
        when(result.isOk()).thenReturn(false);
        try {
            MockSlingHttpServletResponse mockResponse = context.response();
            underTest.doGet(context.request(), mockResponse);
            assertEquals(HttpServletResponse.SC_SERVICE_UNAVAILABLE, mockResponse.getStatus());


        } catch (ServletException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }



}
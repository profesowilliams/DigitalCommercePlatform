package com.techdata.core.servlets;


import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;


import com.day.cq.wcm.api.Page;
import com.techdata.core.slingcaconfig.CommonConfigurations;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.caconfig.ConfigurationBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static junit.framework.Assert.*;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class FormServletTest {
    private FormServlet underTest;
    Method internalEmailAddressMethod;

    @Mock
    Resource resource;

    @Mock
    Page page;

    @Mock
    private ConfigurationBuilder configurationBuilder;

    @Mock
    private CommonConfigurations commonConfigurations;

    @BeforeEach
    void setUp() {
        underTest = new FormServlet();
        Mockito.when(resource.adaptTo(Page.class)).thenReturn(page);
    }

    @Test
    void testGettingInternalEmailBasedOnFormKey() throws InvocationTargetException, IllegalAccessException {

        Method internalEmailAddressMethod;

        try {
            internalEmailAddressMethod = underTest.getClass().getDeclaredMethod("getInternalEmailAddressArray", Map.class, String[].class, Map.class);
            internalEmailAddressMethod.setAccessible(true);
//            assertNull(internalEmailAddressMethod);
            Map<String, String> testParameterMapWithKey = new HashMap<String, String>();
            Map<String, String> testParameterMapWithoutKey = new HashMap<String, String>();
            Map<String, String[]> testGroupEmailParameterMap = new HashMap<String, String[]>();
            testParameterMapWithKey.put(":group", "apac");
            testParameterMapWithoutKey.put(":group", "no-key");

            testGroupEmailParameterMap.put("apac", new String[]{"test@test.com"});
            testGroupEmailParameterMap.put("hk", new String[]{"hk@test.com"});
            String[] defaultAddressArray = new String[]{"default@defailt.com"};
            String[] response1 = (String[]) internalEmailAddressMethod.invoke(underTest, testParameterMapWithKey, defaultAddressArray, testGroupEmailParameterMap);
            String[] response2 = (String[]) internalEmailAddressMethod.invoke(underTest, testParameterMapWithoutKey, defaultAddressArray, testGroupEmailParameterMap);
            assertTrue(response1.length > 0);
            assertTrue(response2.length > 0);
            assertEquals("test@test.com", response1[0]);
            assertEquals("default@defailt.com", response2[0]);


        } catch (NoSuchMethodException ignored) {
        }
    }


        @Test
        void testGettingGeneratingGroupMap() throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
            Method underTestMethod;
            underTestMethod = underTest.getClass().getDeclaredMethod("getMapOfEmailAddress", String[].class);
            underTestMethod.setAccessible(true);
            String[] arrayFromCA = new String[] {"apac|test@gmail.com,apac@apac.com", "hk|hk@hk.com"};
            String[] arrayFromCA2 = new String[] {"apac&test@gmail.com,apac@apac.com", "hk&hk@hk.com"};

            Map<String, String[]> mapFromMethod = (Map<String, String[]>) underTestMethod.invoke(underTest, new Object[] {arrayFromCA});
            String[] val = mapFromMethod.get("apac");
            assertNotNull(val);
            assertEquals("test@gmail.com", val[0]);
            Map<String, String[]> mapFromMethod2 = (Map<String, String[]>) underTestMethod.invoke(underTest, new Object[] {arrayFromCA2});
            String[] val2 = mapFromMethod2.get("apac");
            assertNull(val2);

        }

    @Test
    void testPopulateEmailAttributesFromCAConfig() throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
        String[] arrayFromCA = new String[] {"apac|test@gmail.com,apac@apac.com", "hk|hk@hk.com"};
        String[] defaultAddressArray = new String[]{"default@defailt.com"};
        String[] allowedFileTypesArray = new String[]{".pdf", ".gif"};
        Map<String, String[]> emailParams = new HashMap<>();

        Method underTestMethod;
        underTestMethod = underTest.getClass().getDeclaredMethod("populateEmailAttributesFromCAConfig", Resource.class, Map.class);
        underTestMethod.setAccessible(true);
        when(page.adaptTo(ConfigurationBuilder.class)).thenReturn(configurationBuilder);
        when(configurationBuilder.as(CommonConfigurations.class)).thenReturn(commonConfigurations);
        when(commonConfigurations.formSubmissionTargetGroups()).thenReturn(arrayFromCA);
        when(commonConfigurations.submitterEmailFieldName()).thenReturn("submitterEmailFieldName");
        when(commonConfigurations.confirmationEmailBody()).thenReturn("confirmationEmailBody");
        when(commonConfigurations.internalEmailTemplatePath()).thenReturn("internalEmailTemplatePath");
        when(commonConfigurations.confirmationEmailTemplatePath()).thenReturn("confirmationEmailTemplatePath");
        when(commonConfigurations.emailSubject()).thenReturn("emailSubject");
        when(commonConfigurations.confirmationEmailSubject()).thenReturn("confirmationEmailSubject");
        when(commonConfigurations.allowedFileTypes()).thenReturn(allowedFileTypesArray);

        boolean flag = (boolean) underTestMethod.invoke(underTest, resource, emailParams);
        assertTrue(flag);
    }


}
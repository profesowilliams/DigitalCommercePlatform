package com.techdata.core.workflows;

import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.techdata.core.util.Constants;
import com.techdata.core.util.ContentFragmentUtil;
import com.techdata.core.util.UIServiceHelper;
import com.techdata.core.workflow.process.impl.CatalogServiceSynchProcess;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.PersistenceException;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.RepositoryException;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class CatalogServiceSynchProcessTest {
    @InjectMocks
    CatalogServiceSynchProcess catalogServiceSynchProcess;
    @Mock
    WorkItem workItem;
    @Mock
    WorkflowSession workflowSession;
    @Mock
    MetaDataMap metaDataMap;
    @Mock
    UIServiceHelper uiServiceHelper;
    @Mock
    ResourceResolver resourceResolver;
    @Mock
    ContentFragmentUtil fragmentUtil;

    @Test
    void testexecute() throws WorkflowException, PersistenceException, RepositoryException {
        String JSON_TEST_DATA = "{\n" +
                "\t\"content\": {\n" +
                "\t\t\"items\": [{\n" +
                "\t\t\t\"item1\": \"item2\"\n" +
                "\t\t}]\n" +
                "\t}\n" +
                "}";
        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(JSON_TEST_DATA, JsonObject.class);
        JsonArray items = null;
        when(metaDataMap.containsKey(Constants.WORKFLOW_ARGS_KEY)).thenReturn(true);
        when(metaDataMap.get(Constants.WORKFLOW_ARGS_KEY, String.class)).thenReturn("arguments1,arguments2");
        when(uiServiceHelper.getUIServiceJSONResponse("arguments1","arguments2")).thenReturn(jsonObject);
        when(workflowSession.adaptTo(ResourceResolver.class)).thenReturn(resourceResolver);
        fragmentUtil.processSyncContentFragments(any(),any(),any());
        catalogServiceSynchProcess.execute(workItem,workflowSession,metaDataMap);
    }
}

package com.techdata.core.workflow.process.impl;

import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.WorkflowProcess;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.techdata.core.util.Constants;
import com.techdata.core.util.ContentFragmentUtil;
import com.techdata.core.util.UIServiceHelper;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.PersistenceException;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;

@Component(
        service = WorkflowProcess.class,
        property = "process.label=Techdata Synchronize Catalog Service into AEM Content Fragments"
)
public class CatalogServiceSynchProcess implements WorkflowProcess {
    private static final Logger log = LoggerFactory.getLogger(CatalogServiceSynchProcess.class);
    private static final String SESSION_ID = "session-id";
    private static final String CATALOG_SERVICE_ENDPOINT = "http://localhost:3000/catalog";

    @Reference
    UIServiceHelper uiServiceHelper;

    private ContentFragmentUtil fragmentUtil = new ContentFragmentUtil();

    public final void execute(WorkItem workItem, WorkflowSession workflowSession, MetaDataMap metaDataMap) throws WorkflowException {
        try  {
            String arguments = metaDataMap.containsKey(Constants.WORKFLOW_ARGS_KEY) ?  metaDataMap.get(Constants.WORKFLOW_ARGS_KEY, String.class) : StringUtils.EMPTY;
            log.debug("inside execute args is {}", arguments);
            String[] argumentsSplit = arguments.split(Constants.COMMA);
            String uiServiceEndPoint = CATALOG_SERVICE_ENDPOINT;
            String sessionId = SESSION_ID;
            if (!arguments.isEmpty() && argumentsSplit.length > 1)
            {
                log.debug("updating catalog synch with params from workflow");
                uiServiceEndPoint = argumentsSplit[0];
                sessionId =argumentsSplit[1];
            }

            JsonObject jsonObject = uiServiceHelper.getUIServiceJSONResponse(uiServiceEndPoint, sessionId);

            ResourceResolver resourceResolver = getResourceResolver(workflowSession);
            JsonArray items = jsonObject.getAsJsonObject("content").getAsJsonArray("items");

            fragmentUtil.processSyncContentFragments(items, Constants.CATALOG_ROOT_PARENT_PATH, resourceResolver);
        } catch (PersistenceException | RepositoryException e) {
            log.error("Error in execute", e);
        }
    }

    private ResourceResolver getResourceResolver(WorkflowSession workflowSession) {
        return workflowSession.adaptTo(ResourceResolver.class);
    }


}

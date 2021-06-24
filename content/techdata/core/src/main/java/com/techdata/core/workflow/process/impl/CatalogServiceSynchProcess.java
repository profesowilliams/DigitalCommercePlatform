package com.techdata.core.workflow.process.impl;

import com.adobe.aemds.guide.utils.JcrResourceConstants;
import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.dam.cfm.ContentFragmentException;
import com.adobe.cq.dam.cfm.FragmentTemplate;
import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.WorkflowProcess;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.techdata.core.util.Constants;
import com.techdata.core.util.UIServiceHelper;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.PersistenceException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.Iterator;

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
            processSynchContentFragments(items, Constants.CATALOG_ROOT_PARENT_PATH, resourceResolver);
        } catch (Exception e) {
            log.error("Error in execute", e);
        }

    }

    private Resource getParentResource(String path, ResourceResolver resolver) throws PersistenceException, RepositoryException {
        Resource parent = resolver.getResource(path);
        if(parent != null) return parent;
        createFolder(path, resolver);
        return resolver.getResource(path);
    }

    private void processSynchContentFragments(JsonArray items, String parentPath, ResourceResolver resourceResolver) throws PersistenceException, RepositoryException {
        log.debug("inside processSynchContentFragments. Processing path {}", parentPath);
        Resource parent = getParentResource(parentPath, resourceResolver);

        Resource template = resourceResolver.getResource(Constants.CATALOG_CF_MODEL_PATH);

        for(JsonElement jsonElement : items)
        {
            JsonObject jsonItemObject = jsonElement.getAsJsonObject();
            if (null != jsonItemObject && jsonItemObject.has(Constants.CATALOG_JSON_KEY_FIELD_NAME)) {
                String key = jsonItemObject.get(Constants.CATALOG_JSON_KEY_FIELD_NAME).getAsString();
                String name = jsonItemObject.get(Constants.CATALOG_JSON_NAME_FIELD_NAME).isJsonNull() ? "" : jsonItemObject.get(Constants.CATALOG_JSON_NAME_FIELD_NAME).getAsString();
                saveContentFragment(parent, template, key, name, jsonItemObject, resourceResolver);
                if (jsonItemObject.has(Constants.CATALOG_JSON_CHILDREN_FIELD_NAME) )
                {
                    JsonArray children = jsonItemObject.getAsJsonArray(Constants.CATALOG_JSON_CHILDREN_FIELD_NAME);
                    if (children.size() > 0)
                    {
                        String newParentPath = parentPath + Constants.SLASH + key + Constants.CATALOG_CF_CHILDREN_FOLDER_SUFFIX;
                        processSynchContentFragments(children, newParentPath, resourceResolver);
                    }
                }
            }else{
                log.debug("No 'key' property found for {} synch", parentPath);
            }

        }

    }

    private void saveContentFragment(Resource parent, Resource template, String key, String name,
                                     JsonObject jsonItemObject, ResourceResolver resourceResolver) {
        try {
            ContentFragment cf = getOrCreateFragment(parent, template, key, name);
            setContentElements(cf,jsonItemObject);
            resourceResolver.commit();
            resourceResolver.refresh();
        } catch (ContentFragmentException | PersistenceException e) {
            e.printStackTrace();
        }
    }

    private boolean createFolder(String path, ResourceResolver resourceResolver) throws RepositoryException, PersistenceException {
            log.debug("inside createFolder. path is {}", path);
            Session s = resourceResolver.adaptTo(Session.class);
            if (s.nodeExists(path)) {
                return false;
            }

            String name = StringUtils.substringAfterLast(path, Constants.SLASH);
            String parentPath = StringUtils.substringBeforeLast(path, Constants.SLASH);
            createFolder(parentPath, resourceResolver);

            s.getNode(parentPath).addNode(name, JcrResourceConstants.NT_SLING_ORDERED_FOLDER);
            resourceResolver.commit();
            resourceResolver.refresh();
            return true;
    }


    private void setContentElements(ContentFragment cf, JsonObject row) throws ContentFragmentException {
        log.debug("Processing Content Fragment at path {}",  cf.adaptTo(Resource.class).getPath());

        for (Iterator<ContentElement> i = cf.getElements(); i.hasNext();) {

            ContentElement contentElement = i.next();
            String keyName = contentElement.getName();

            if (row.has(keyName) ) {
                String currentValue = contentElement.getContent();
                log.debug("field {} contains {} in CF", keyName, currentValue);
                JsonElement o = row.get(keyName);
                String value = o.isJsonNull() ? StringUtils.EMPTY : o.getAsString();
                log.debug("field {} in json object is {}", keyName, value);

                if ( !String.valueOf(value).equals(String.valueOf(currentValue)))
                {
                    log.debug("values in CF and values coming in are different. {} vs {}", value, currentValue);
                }else{
                    log.debug("values are same");
                }
                contentElement.setContent(value, contentElement.getContentType());

            }else{
                log.debug("key {} is not in content fragment", keyName);
            }
            log.debug("within iterator of cf. key is {}. Type is {}", contentElement.getName(), contentElement.getContentType());

        }
    }

    protected ContentFragment getOrCreateFragment(Resource parent, Resource template, String name, String title) throws ContentFragmentException {

        Resource fragmentResource = parent.getChild(name);
        if (fragmentResource == null) {
            try {
                FragmentTemplate fragmentTemplate = template.adaptTo(FragmentTemplate.class);
                return fragmentTemplate.createFragment(parent, name, title);
            } catch (  ContentFragmentException ex) {
                log.error("Unable to call createFragment method -- Is this 6.3 or newer?", ex);
                return null;
            }
        } else {
            return fragmentResource.adaptTo(ContentFragment.class);
        }
    }

    private ResourceResolver getResourceResolver(WorkflowSession workflowSession) {
        return workflowSession.adaptTo(ResourceResolver.class);
    }
}

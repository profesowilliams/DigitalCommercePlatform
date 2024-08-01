package com.techdata.core.workflow.process.impl;

import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.WorkflowProcess;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.version.Version;
import javax.jcr.version.VersionHistory;
import javax.jcr.version.VersionIterator;
import javax.jcr.version.VersionManager;
import java.util.Calendar;
import java.util.HashSet;
import java.util.Set;

@Component(
        service = WorkflowProcess.class,
        property = {"process.label=Techdata Determine if there are structural or text changes on APJ"}
)
public class ApjPageChangesProcess implements WorkflowProcess {
    private static final Logger log = LoggerFactory.getLogger(CatalogServiceSynchProcess.class);
    public static final String REQUIRES_VALIDATION = "requiresValidation";
    public static final String STRUCTURAL_CHANGES = "structuralChanges";
    public static final String TEXT_CHANGES = "textChanges";
    public static final String CQ_LAST_REPLICATED = "cq:lastReplicated";
    private static final String SLASH_JCR_CONTENT = "/jcr:content";

    @Override
    public void execute(WorkItem workItem, WorkflowSession workflowSession, MetaDataMap args) throws WorkflowException {
        try {
            ResourceResolver resourceResolver = workflowSession.adaptTo(ResourceResolver.class);
            String payloadPath = workItem.getWorkflowData().getPayload().toString();
            Resource pageResource = resourceResolver.getResource(payloadPath + SLASH_JCR_CONTENT);

            if (pageResource != null && !pageResource.isResourceType(Resource.RESOURCE_TYPE_NON_EXISTING)) {
                PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
                Page page = pageManager.getContainingPage(pageResource);
                Node currentNode = page.adaptTo(Node.class);

                Version currentVersion = getCurrentVersion(currentNode);
                Version lastActivatedVersion = getLastActivatedVersion(currentNode);
                boolean hasStructuralChanges = hasStructuralChanges(currentVersion, lastActivatedVersion);

                if (hasStructuralChanges) {
                    workItem.getWorkflowData().getMetaDataMap().put(REQUIRES_VALIDATION, STRUCTURAL_CHANGES);
                } else {
                    workItem.getWorkflowData().getMetaDataMap().put(REQUIRES_VALIDATION, TEXT_CHANGES);
                }
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new WorkflowException(e.getMessage(), e);
        }
    }

    private Version getLastActivatedVersion(Node node) throws RepositoryException {
        Session session = node.getSession();
        VersionManager versionManager = session.getWorkspace().getVersionManager();
        VersionHistory versionHistory = versionManager.getVersionHistory(node.getPath() + SLASH_JCR_CONTENT);

        Version lastActivatedVersion = null;
        Calendar lastReplicationDate = null;

        for (VersionIterator it = versionHistory.getAllVersions(); it.hasNext(); ) {
            Version version = it.nextVersion();
            Node frozenNode = version.getFrozenNode();

            if (frozenNode.hasProperty(CQ_LAST_REPLICATED)) {
                Calendar replicationDate = frozenNode.getProperty(CQ_LAST_REPLICATED).getDate();
                if (lastReplicationDate == null || replicationDate.after(lastReplicationDate)) {
                    lastActivatedVersion = version;
                    lastReplicationDate = replicationDate;
                }
            }
        }

        return lastActivatedVersion;
    }

    private Version getCurrentVersion(Node node) throws RepositoryException {
        VersionManager versionManager = node.getSession().getWorkspace().getVersionManager();

        return versionManager.getBaseVersion(node.getPath() + SLASH_JCR_CONTENT);
    }

    private boolean hasStructuralChanges(Version currentVersion, Version lastActivatedVersion) throws RepositoryException {
        if (lastActivatedVersion == null || currentVersion == null) {
            return false;
        }

        return hasStructuralChangesInsideChildNodes(currentVersion.getFrozenNode(), lastActivatedVersion.getFrozenNode());
    }

    private boolean hasStructuralChangesInsideChildNodes(Node currentNode, Node lastActivatedNode) throws RepositoryException {
        Set<String> currentChildNames = getChildNodeNames(currentNode);
        Set<String> lastActivatedChildNames = getChildNodeNames(lastActivatedNode);

        if (!currentChildNames.equals(lastActivatedChildNames)) {
            return true;
        }

        for (String childName : currentChildNames) {
            Node currentChildNode = currentNode.getNode(childName);
            Node lastActivatedChildNode = lastActivatedNode.getNode(childName);

            if (hasStructuralChangesInsideChildNodes(currentChildNode, lastActivatedChildNode)) {
                return true;
            }
        }

        return false;
    }

    private Set<String> getChildNodeNames(Node node) throws RepositoryException {
        Set<String> childNames = new HashSet<>();
        NodeIterator nodeIterator = node.getNodes();
        while (nodeIterator.hasNext()) {
            Node childNode = nodeIterator.nextNode();
            childNames.add(childNode.getName());
        }

        return childNames;
    }
}

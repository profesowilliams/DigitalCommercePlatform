package com.tdscore.core.workflow.process.impl;

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
        property = {"process.label=TDS-Core APJ page changes process"}
)
public class ApjPageChangesProcess implements WorkflowProcess {
    private static final Logger log = LoggerFactory.getLogger(ApjPageChangesProcess.class);
    public static final String REQUIRES_VALIDATION = "requiresValidation";
    public static final String STRUCTURAL_CHANGES = "structuralChanges";
    public static final String TEXT_CHANGES = "textChanges";
    public static final String CQ_LAST_REPLICATED = "cq:lastReplicated";
    private static final String SLASH_JCR_CONTENT = "/jcr:content";
    public static final String JCR_CONTENT = "jcr:content";
    public static final String TOLERANCE_IN_SECONDS_ARG = "toleranceInSecArg";
    public static final int DEFAULT_TOLERANCE_IN_SECONDS = 5;

    private Long toleranceInSeconds;

    @Override
    public void execute(WorkItem workItem, WorkflowSession workflowSession, MetaDataMap args) throws WorkflowException {
        try {
            ResourceResolver resourceResolver = workflowSession.adaptTo(ResourceResolver.class);
            String payloadPath = workItem.getWorkflowData().getPayload().toString();
            Resource pageResource = resourceResolver.getResource(payloadPath + SLASH_JCR_CONTENT);

            toleranceInSeconds = (Long) workItem.getWorkflowData().getMetaDataMap().getOrDefault(TOLERANCE_IN_SECONDS_ARG, DEFAULT_TOLERANCE_IN_SECONDS);

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
        Version lastActivatedVersion = null;

        Node contentNode = node.getNode(JCR_CONTENT);
        if (!contentNode.hasProperty(CQ_LAST_REPLICATED)) {
            return lastActivatedVersion;
        }
        Calendar lastReplicationDate = contentNode.getProperty(CQ_LAST_REPLICATED).getDate();

        Session session = node.getSession();
        VersionManager versionManager = session.getWorkspace().getVersionManager();
        VersionHistory versionHistory = versionManager.getVersionHistory(node.getPath() + SLASH_JCR_CONTENT);

        for (VersionIterator it = versionHistory.getAllVersions(); it.hasNext(); ) {
            Version version = it.nextVersion();

            if (areDatesEqualWithinTolerance(lastReplicationDate, version.getCreated(), toleranceInSeconds)) {
                lastActivatedVersion = version;
                break;
            }
        }

        return lastActivatedVersion;
    }

    private boolean areDatesEqualWithinTolerance(Calendar calendar1, Calendar calendar2, long toleranceInSeconds) {
        long timeInMillis1 = calendar1.getTimeInMillis();
        long timeInMillis2 = calendar2.getTimeInMillis();

        long differenceInMillis = Math.abs(timeInMillis1 - timeInMillis2);
        long toleranceInMillis = toleranceInSeconds * 1000;

        return differenceInMillis <= toleranceInMillis;
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

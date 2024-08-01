package com.techdata.core.workflows;

import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.WorkflowData;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.techdata.core.workflow.process.impl.ApjPageChangesProcess;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Property;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Workspace;
import javax.jcr.version.Version;
import javax.jcr.version.VersionHistory;
import javax.jcr.version.VersionIterator;
import javax.jcr.version.VersionManager;
import java.util.Calendar;
import java.util.UUID;

import static com.techdata.core.workflow.process.impl.ApjPageChangesProcess.CQ_LAST_REPLICATED;
import static com.techdata.core.workflow.process.impl.ApjPageChangesProcess.REQUIRES_VALIDATION;
import static com.techdata.core.workflow.process.impl.ApjPageChangesProcess.STRUCTURAL_CHANGES;
import static com.techdata.core.workflow.process.impl.ApjPageChangesProcess.TEXT_CHANGES;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ApjPageChangesProcessTest {

    @InjectMocks
    private ApjPageChangesProcess apjPageChangesProcess;

    @Mock
    private WorkItem workItem;

    @Mock
    private WorkflowSession workflowSession;

    @Mock
    private MetaDataMap args;

    @Mock
    private ResourceResolver resourceResolver;

    @Mock
    private PageManager pageManager;

    @Mock
    private Page page;

    @Mock
    private Resource pageResource;

    @Mock
    private Node currentNode;

    @Mock
    private Session session;

    @Mock
    private VersionManager versionManager;

    @Mock
    private VersionHistory versionHistory;

    @Mock
    private Version currentVersion;

    @Mock
    private Version lastActivatedVersion;

    @Mock
    private Node currentFrozenNode;

    @Mock
    private Node lastActivatedFrozenNode;

    @Mock
    private WorkflowData workflowData;

    @Mock
    private MetaDataMap metaDataMap;

    private static final String PAGE_PATH = UUID.randomUUID().toString();
    private static final String CHILD_NODE_NAME_1 = UUID.randomUUID().toString();
    private static final String CHILD_NODE_NAME_2 = UUID.randomUUID().toString();

    @BeforeEach
    public void setUp() throws RepositoryException {
        when(workflowSession.adaptTo(ResourceResolver.class)).thenReturn(resourceResolver);
        when(resourceResolver.getResource(anyString())).thenReturn(pageResource);
        when(pageResource.isResourceType(Resource.RESOURCE_TYPE_NON_EXISTING)).thenReturn(false);
        when(resourceResolver.adaptTo(PageManager.class)).thenReturn(pageManager);
        when(pageManager.getContainingPage(pageResource)).thenReturn(page);
        when(page.adaptTo(Node.class)).thenReturn(currentNode);
        when(currentNode.getSession()).thenReturn(session);
        when(session.getWorkspace()).thenReturn(mock(Workspace.class));
        when(session.getWorkspace().getVersionManager()).thenReturn(versionManager);
        when(workItem.getWorkflowData()).thenReturn(workflowData);
        when(workflowData.getMetaDataMap()).thenReturn(metaDataMap);
    }

    @Test
    public void testExecuteWithNoStructuralChanges() throws Exception {
        Calendar replicationDate = Calendar.getInstance();

        when(workItem.getWorkflowData().getPayload()).thenReturn(PAGE_PATH);
        when(versionManager.getBaseVersion(anyString())).thenReturn(currentVersion);
        when(versionManager.getVersionHistory(anyString())).thenReturn(versionHistory);
        when(currentVersion.getFrozenNode()).thenReturn(currentFrozenNode);
        when(lastActivatedVersion.getFrozenNode()).thenReturn(lastActivatedFrozenNode);

        when(lastActivatedFrozenNode.hasProperty(CQ_LAST_REPLICATED)).thenReturn(true);
        when(lastActivatedFrozenNode.getProperty(CQ_LAST_REPLICATED)).thenReturn(mock(Property.class));
        when(lastActivatedFrozenNode.getProperty(CQ_LAST_REPLICATED).getDate()).thenReturn(replicationDate);

        VersionIterator versionIterator = mock(VersionIterator.class);
        when(versionIterator.hasNext()).thenReturn(true, false);
        when(versionIterator.nextVersion()).thenReturn(lastActivatedVersion);
        when(versionHistory.getAllVersions()).thenReturn(versionIterator);

        NodeIterator nodeIterator = mock(NodeIterator.class);
        when(nodeIterator.hasNext()).thenReturn(false);

        when(currentFrozenNode.getNodes()).thenReturn(nodeIterator);
        when(lastActivatedFrozenNode.getNodes()).thenReturn(nodeIterator);

        apjPageChangesProcess.execute(workItem, workflowSession, args);

        verify(workItem.getWorkflowData().getMetaDataMap()).put(REQUIRES_VALIDATION, TEXT_CHANGES);
    }

    @Test
    public void testExecuteWithStructuralChanges() throws Exception {
        Calendar replicationDate = Calendar.getInstance();

        when(workItem.getWorkflowData().getPayload()).thenReturn(PAGE_PATH);
        when(versionManager.getBaseVersion(anyString())).thenReturn(currentVersion);
        when(versionManager.getVersionHistory(anyString())).thenReturn(versionHistory);
        when(currentVersion.getFrozenNode()).thenReturn(currentFrozenNode);

        when(lastActivatedVersion.getFrozenNode()).thenReturn(lastActivatedFrozenNode);
        when(lastActivatedFrozenNode.hasProperty(CQ_LAST_REPLICATED)).thenReturn(true);
        when(lastActivatedFrozenNode.getProperty(CQ_LAST_REPLICATED)).thenReturn(mock(Property.class));
        when(lastActivatedFrozenNode.getProperty(CQ_LAST_REPLICATED).getDate()).thenReturn(replicationDate);

        VersionIterator versionIterator = mock(VersionIterator.class);
        when(versionIterator.hasNext()).thenReturn(true, false);
        when(versionIterator.nextVersion()).thenReturn(lastActivatedVersion);
        when(versionHistory.getAllVersions()).thenReturn(versionIterator);

        Node currentChildNode1 = mock(Node.class);
        Node currentChildNode2 = mock(Node.class);
        Node lastActivatedChildNode = mock(Node.class);
        NodeIterator currentChildNodes = mock(NodeIterator.class);
        when(currentChildNodes.hasNext()).thenReturn(true, true, false);
        when(currentChildNodes.nextNode()).thenReturn(currentChildNode1, currentChildNode2);
        when(currentChildNode1.getName()).thenReturn(CHILD_NODE_NAME_1);
        when(currentChildNode2.getName()).thenReturn(CHILD_NODE_NAME_2);

        NodeIterator lastActivatedChildNodes = mock(NodeIterator.class);
        when(lastActivatedChildNodes.hasNext()).thenReturn(true, false);
        when(lastActivatedChildNodes.nextNode()).thenReturn(lastActivatedChildNode);
        when(lastActivatedChildNode.getName()).thenReturn(CHILD_NODE_NAME_1);

        when(currentFrozenNode.getNodes()).thenReturn(currentChildNodes);
        when(lastActivatedFrozenNode.getNodes()).thenReturn(lastActivatedChildNodes);

        apjPageChangesProcess.execute(workItem, workflowSession, args);

        verify(workItem.getWorkflowData().getMetaDataMap()).put(REQUIRES_VALIDATION, STRUCTURAL_CHANGES);
    }
}

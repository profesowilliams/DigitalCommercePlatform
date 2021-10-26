package com.techdata.core.servlets;

import java.io.IOException;
import java.util.List;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

import org.osgi.service.component.ComponentContext;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.hc.api.execution.HealthCheckExecutionOptions;
import org.apache.sling.hc.api.execution.HealthCheckExecutionResult;
import org.apache.sling.hc.api.execution.HealthCheckExecutor;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component(
    service = Servlet.class,
    property = {
		Constants.SERVICE_DESCRIPTION + "=TechData Health Check Servlet",
		"sling.servlet.methods=" + HttpConstants.METHOD_GET, 
        "sling.servlet.paths=" + "/system/health"
    }
)
public class TechDataHealthCheckServlet extends SlingSafeMethodsServlet {

    @Reference
    protected transient HealthCheckExecutor healthCheckExecutor;

    private static final Logger logger = LoggerFactory.getLogger(TechDataHealthCheckServlet.class);

    @Activate
    protected void activate(ComponentContext context) {
        logger.debug("Starting HealthCheckExecutorServlet");
    }

    @Deactivate
    protected void deactivate() {
        logger.debug("Stopping HealthCheckExecutorServlet");
    }

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
                                                        throws ServletException, IOException {
        response.setContentType("application/json");
        response.setHeader("Cache-Control", "must-revalidate,no-cache,no-store");

        // execute health checks (random tags right now, can be specified in the future)
        final String[] tags = { "security", "system", "bundles", "respository", "disk", "replication" };
        HealthCheckExecutionOptions options = new HealthCheckExecutionOptions();
        options.setCombineTagsWithOr(true);
        options.setForceInstantExecution(true);
        List<HealthCheckExecutionResult> results = healthCheckExecutor.execute(options, tags);

        // check results
        boolean allOk = true;
        for(HealthCheckExecutionResult result : results) {
            if(!result.getHealthCheckResult().isOk()) {
                allOk = false;
                break;
            }
        }

        // set appropriate status code
        if(!allOk) {
            response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
        } else {
            response.setStatus(HttpServletResponse.SC_OK);
        }

        // write out JSON response
        JSONObject resultJson = new JSONObject();
        try {
            generateResponse(results, resultJson);
        } catch(JSONException ex) {
            logger.error("Could not serialize result into JSON", ex);
        }
        response.getWriter().write(resultJson.toString());
    }

    /**
     * Creates a JSON representation of the given HealthCheckExecutionResult list.
     * @param executionResults
     * @param resultJson
     * @return
     * @throws JSONException
     */
    private static JSONObject generateResponse(List<HealthCheckExecutionResult> executionResults,
                                                JSONObject resultJson) throws JSONException {
        JSONArray resultsJsonArr = new JSONArray();
        resultJson.put("results", resultsJsonArr);

        for (HealthCheckExecutionResult healthCheckResult : executionResults) {
            JSONObject result = new JSONObject();
            result.put("name", healthCheckResult.getHealthCheckMetadata() != null ?
                               healthCheckResult.getHealthCheckMetadata().getName() : "");
            result.put("details", healthCheckResult.getHealthCheckResult().toString());
            result.put("status", healthCheckResult.getHealthCheckResult().getStatus());
            result.put("timeMs", healthCheckResult.getElapsedTimeInMs());
            final JSONArray categories = new JSONArray();
            healthCheckResult.getHealthCheckMetadata().getTags().forEach(categories::put);
            result.put("categories", categories);
            resultsJsonArr.put(result);
        }
        return resultJson;
    }
}

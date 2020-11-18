package com.techdata.platform.core.servlets;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.propertytypes.ServiceDescription;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;

import java.io.BufferedReader;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpClient.Redirect;
import java.net.http.HttpClient.Version;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse.BodyHandlers;
import java.time.Duration;
import java.util.stream.Collectors;

import com.techdata.platform.core.models.CartComponentData;
import com.techdata.platform.core.models.businessModels.Price;
import com.techdata.platform.core.models.apiModels.CartActionRequest;
import com.techdata.platform.core.models.apiModels.CartActionResponse;

@Component(service = Servlet.class, property = { "sling.servlet.methods=GET,POST",
        "sling.servlet.resourceTypes = digitalCommerce/components/content", "sling.servlet.selectors = cart",
        "sling.servlet.paths=/bin/api/cart", "sling.servlet.extensions=json" })
@ServiceDescription("Cart Servlet")

public class CartServlet extends SlingAllMethodsServlet {

    private static final long serialVersionUID = 2L;

    private String makeRequest(HttpRequest request) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newBuilder().version(Version.HTTP_1_1).followRedirects(Redirect.NORMAL)
                .connectTimeout(Duration.ofSeconds(20)).build();
        HttpResponse<String> response = client.send(request, BodyHandlers.ofString());
        return response.body();
    }

    private String get(String url) throws IOException, InterruptedException {
        // String apiResponse = "";
        // try {
        // apiResponse = get("http://jsonplaceholder.typicode.com/todos/1");
        // } catch (Exception e1) {
        // apiResponse = "{error: " + e1.getMessage() + "}";
        // }
        HttpRequest request = HttpRequest.newBuilder().GET().uri(URI.create(url)).build();
        return makeRequest(request);
    }

    private String post(String uri, String data) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder().uri(URI.create(uri)).POST(BodyPublishers.ofString(data)).build();
        return makeRequest(request);
    }

    @Override
    protected void doGet(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws ServletException, IOException {

        String cartId = request.getParameter("cartId");
        java.util.Random random = new java.util.Random();
        Price price = new Price(random.nextInt(200000), "USD");
        CartComponentData data = new CartComponentData(cartId, random.nextInt(99), price);

        ObjectMapper mapper = new ObjectMapper();
        String apiResponse = mapper.writeValueAsString(data);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(apiResponse);
    }

    @Override
    protected void doPost(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws ServletException, IOException {

        ObjectMapper mapper = new ObjectMapper();
        String apiResponse = null;

        try {
            CartActionRequest req = request.adaptTo(CartActionRequest.class);
            CartActionResponse res = new CartActionResponse(req.getCartId(), req.getAction(), true);
            apiResponse = mapper.writeValueAsString(res);
        } catch (Exception e) {
            apiResponse = "{error :" + e.getMessage() + "}";
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(apiResponse);
    }
}

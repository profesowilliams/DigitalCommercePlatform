package com.techdata.platform.core.models;

import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import javax.annotation.PostConstruct;
import org.apache.sling.api.resource.Resource;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techdata.platform.core.models.businessModels.Price;

@Model(adaptables = { Resource.class })
@Exporter(name = "jackson", extensions = "json")

public class CartComponentModel extends BaseComponentModel {

    private CartComponentData cartData = null;

    @SlingObject
    private Resource resource;

    @PostConstruct
    public void init() throws Exception {
        // API call for retrieve data related to cart
        java.util.Random random = new java.util.Random();
        Price price = new Price(random.nextInt(10000), "USD");
        this.cartData = new CartComponentData(java.util.UUID.randomUUID().toString(), random.nextInt(99), price);
    }

    public String getCartData() throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(cartData);
    }
}

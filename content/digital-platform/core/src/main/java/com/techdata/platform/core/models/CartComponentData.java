package com.techdata.platform.core.models;

import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import com.techdata.platform.core.models.businessModels.Price;
import org.apache.sling.api.SlingHttpServletResponse;

@Model(adaptables = { SlingHttpServletResponse.class }, resourceType = { "digitalCommerce/components/content/cart" })
@Exporter(name = "jackson", extensions = "json")

public class CartComponentData {

    public CartComponentData() {
    }

    public CartComponentData(String cartId, Number numberOfItems, Price subtotal) {
        this.cartId = cartId;
        this.numberOfItems = numberOfItems;
        this.subtotal = subtotal;
    }

    private String cartId;
    private Number numberOfItems;
    private Price subtotal;

    public String getCartId() {
        return cartId;
    }

    public Number getNumberOfItems() {
        return numberOfItems;
    }

    public Price getSubtotal() {
        return subtotal;
    }
}

package com.techdata.platform.core.models.apiModels;

import org.apache.sling.models.annotations.Exporter;

@Exporter(name = "jackson", extensions = "json")
public class CartActionResponse {

  public CartActionResponse(String cartId, String action, boolean isSuccesfull) {
    this.cartId = cartId;
    this.action = action;
    this.isSuccesfull = isSuccesfull;
  }

  private String cartId;
  private String action;
  private boolean isSuccesfull;

  public String getCartId() {
    return cartId;
  }

  public String getAction() {
    return action;
  }

  public boolean getIsSuccesfull() {
    return isSuccesfull;
  }
}

package com.techdata.platform.core.models.apiModels;

import javax.annotation.PostConstruct;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;

@Exporter(name = "jackson", extensions = "json")
@Model(adaptables = SlingHttpServletRequest.class)
public class CartActionRequest {

  @SlingObject
  private SlingHttpServletRequest request;

  private String cartId;
  private String action;

  @PostConstruct
  protected void init() {
    this.cartId = request.getParameter("cartId");
    this.action = request.getParameter("action");
  }

  public String getCartId() {
    return cartId;
  }

  public String getAction() {
    return action;
  }
}

package com.techdata.platform.core.models;
 
import javax.inject.Inject;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
 
/**
* Created by kari.thrastarson
*/
@Model(adaptables = Resource.class)
public class CarouselComponentModel {
  @Inject
  @Optional
  private Resource actionItems;
  
  /**
  * @return list of nodes
  */
  public Resource getActionItems() {
    return actionItems;
  }
 
}
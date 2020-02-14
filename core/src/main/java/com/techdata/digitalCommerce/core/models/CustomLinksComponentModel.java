package com.techdata.digitalCommerce.core.models;

import java.util.ArrayList;
import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Model(adaptables = Resource.class, defaultInjectionStrategy = org.apache.sling.models.annotations.DefaultInjectionStrategy.OPTIONAL)
public class CustomLinksComponentModel {
	private static final Logger log = LoggerFactory.getLogger(CustomLinksComponentModel.class);
	@Inject
	private Resource multiField; // (name of the field)
	@Inject
	private int numberOfLinksToDisplay;
	@Inject
	private String columnName; 
	
	
	public String getColumnName() {
		log.info("::Inside custom links Component:::");
		return this.columnName;
	}
	public int getNumberOfLinksToDisplay() {
		return this.numberOfLinksToDisplay;
	}
	
	public ArrayList<NamelinkModel> getCustomLinksList() {
		return this.getNameLinkList(multiField, getNumberOfLinksToDisplay(), "name",
				"link", "isExternal","isNewTab");
	}



	public ArrayList<NamelinkModel> getNameLinkList(Resource resourceList, int numberOfLinksToDisplay, String name,
			String link, String isExternal,String isNewTab) {
		ArrayList<NamelinkModel> nameLinksList = new ArrayList<NamelinkModel>();
		String columnName = "";
		String columnLink = "";
		String columnIsExternal = "";
		boolean columnIsNewTab =false;
		log.info("::resourceList:::" + resourceList);
		log.info("::NumberOfLinksToDisplay:::" + numberOfLinksToDisplay);

		if (resourceList != null) {
			int i = 0;
			for (Resource res : resourceList.getChildren()) {
				columnName = (String) res.getValueMap().get(name);
				columnLink = (String) res.getValueMap().get(link);
				columnIsExternal = (String) res.getValueMap().get(isExternal);
				columnIsNewTab = Boolean.parseBoolean((String) res.getValueMap().get(isNewTab));
				
				if (i < numberOfLinksToDisplay) {
					log.info("::columnCheckbox:::" + columnIsExternal);
					if (!(columnIsExternal.equals("true"))) {
						columnLink = columnLink + ".html";
					}
					nameLinksList.add(new NamelinkModel(columnName, columnLink, columnIsNewTab));
				}
				i++;
			}

		}
		log.info("::numberOfLinksQl:::" + nameLinksList);
		return nameLinksList;
	}
	@PostConstruct
	public void init() {
		this.getCustomLinksList();

	}
	

}

package com.techdata.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import lombok.Getter;
import lombok.Setter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Model(adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
@Setter
public class LinkItem {

    protected static final Logger log = LoggerFactory.getLogger(LinkItem.class);

    @Inject
    private String platformName;

    @Inject
    private String linkUrl;

    @Inject
    private String navigationRoot;

    @Inject
    private String linkTarget;

    @Inject
    private ResourceResolver resolver;

    List<SubNavLinks> subLinks = new ArrayList<>();

    @PostConstruct
    protected void init(){
        if(resolver != null && navigationRoot != null){
            Page rootPage = resolver.adaptTo(PageManager.class).getPage(navigationRoot);
            if(rootPage != null){
                Iterator<Page> children = rootPage.listChildren();
                while(children.hasNext()){
                    Page childPage = children.next();
                    Resource pageResource = childPage.getContentResource();
                    SubNavLinks link = new SubNavLinks(childPage, resolver);
                    subLinks.add(link);
                }
            }
        }
    }
}

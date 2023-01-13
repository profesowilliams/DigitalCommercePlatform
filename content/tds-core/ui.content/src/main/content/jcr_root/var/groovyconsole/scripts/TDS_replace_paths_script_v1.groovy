
// The root CMS path that require replacement of paths
def rootPath = "/content/techdata/testing-branch/bala-blueprint/en/about-us1"

// change from
def sourceResourcePath = "tds-site"
// change to
def targetResourcePath = "techdata"

// src-path1#des-path1£src-path2#des-path2£src-path3#des-path3
def templatePathsList = "/conf/tds-site/settings/wcm/templates/page-content#/conf/techdata/settings/wcm/templates/page-content£/conf/tds-site/settings/wcm/templates/tds-home-page#/conf/techdata/settings/wcm/templates/td-home-page£/conf/tds-site/tds-site-americas/settings/wcm/templates/americas-home-page#/conf/techdata/settings/wcm/templates/td-home-page£/conf/tds-site/tds-site-apj/settings/wcm/templates/apac-home-page#/conf/techdata/settings/wcm/templates/td-home-page£/conf/tds-site/tds-site-europe/settings/wcm/templates/eu-home-page#/conf/techdata/settings/wcm/templates/td-home-page£/conf/tds-site/settings/wcm/templates/tds-content-page#/conf/techdata/settings/wcm/templates/td-content-page£/conf/tds-site/tds-site-americas/settings/wcm/templates/americas-content-page#/conf/techdata/settings/wcm/templates/td-content-page£/conf/tds-site/settings/wcm/templates/apac-content-page1#/conf/techdata/settings/wcm/templates/td-content-page£/conf/tds-site/tds-site-europe/settings/wcm/templates/eu-content-page#/conf/techdata/settings/wcm/templates/td-content-page£/conf/tds-site/settings/wcm/templates/solvs-template#/conf/techdata/settings/wcm/templates/td-content-page£/conf/tds-site/settings/wcm/templates/nano-vendor#/conf/techdata/settings/wcm/templates/td-content-page£/conf/tds-site/settings/wcm/templates/advanced-vendor#/conf/techdata/settings/wcm/templates/td-content-page£/conf/tds-site/settings/wcm/templates/basic-vendor#/conf/techdata/settings/wcm/templates/td-content-page£/conf/tds-site/settings/wcm/templates/tds-landing-page#/conf/techdata/settings/wcm/templates/td-landing-page£/conf/tds-site/tds-site-americas/settings/wcm/templates/americas-landing-page#/conf/techdata/settings/wcm/templates/td-landing-page£/conf/tds-site/tds-site-apj/settings/wcm/templates/apac-landing-page#/conf/techdata/settings/wcm/templates/td-landing-page£/conf/tds-site/tds-site-europe/settings/wcm/templates/eu-landing-page#/conf/techdata/settings/wcm/templates/td-landing-page£/conf/tds-site/settings/wcm/templates/redirect-page#/conf/techdata/settings/wcm/templates/redirect-page£/conf/tds-site/settings/wcm/templates/tds-blog-page#/conf/techdata/settings/wcm/templates/td-blog-page£/conf/tds-site/tds-site-americas/settings/wcm/templates/americas-blog-page#/conf/techdata/settings/wcm/templates/td-blog-page£/conf/tds-site/settings/wcm/templates/blank-page#/conf/techdata/settings/wcm/templates/blank-page£/conf/tds-site/settings/wcm/templates/tds-article-page#/conf/techdata/settings/wcm/templates/td-article-page£/conf/tds-site/tds-site-americas/settings/wcm/templates/americas-article-page#/conf/techdata/settings/wcm/templates/td-article-page£/conf/tds-site/settings/wcm/templates/tds-content-fragment#/conf/techdata/settings/wcm/templates/td-content-fragment£/conf/tds-site/tds-site-americas/settings/wcm/templates/americas-content-fragment#/conf/techdata/settings/wcm/templates/td-content-fragment£/conf/tds-site/tds-site-apj/settings/wcm/templates/apac-content-fragment#/conf/techdata/settings/wcm/templates/td-content-fragment£/conf/tds-site/settings/wcm/templates/tds-subheader-template#/conf/techdata/settings/wcm/templates/td-content-fragment£/conf/tds-site/settings/wcm/templates/apac-home-page#/conf/techdata/settings/wcm/templates/apac-home-page£/conf/tds-site/settings/wcm/templates/apac-landing-page#/conf/techdata/settings/wcm/templates/apac-landing-page£/conf/tds-site/settings/wcm/templates/apac-content-page#/conf/techdata/settings/wcm/templates/apac-content-page£/conf/tds-site/tds-site-apj/settings/wcm/templates/apac-content-page#/conf/techdata/settings/wcm/templates/apac-content-page£/conf/tds-site/settings/wcm/templates/apj-solutions-and-services-template#/conf/techdata/settings/wcm/templates/apac-content-page£/conf/tds-site/tds-site-apj/settings/wcm/templates/apj-solutions-and-services-template#/conf/techdata/settings/wcm/templates/apac-content-page£/conf/tds-site/settings/wcm/templates/apac-content-fragment#/conf/techdata/techdata-apac/settings/wcm/templates/apac-experience-fragment£/conf/tds-site/settings/wcm/templates/apj-xf-subnavigation-template#/conf/techdata/techdata-apac/settings/wcm/templates/apac-experience-fragment£/conf/tds-site/tds-site-apj/settings/wcm/templates/apac-experience-fragment#/conf/techdata/techdata-apac/settings/wcm/templates/apac-experience-fragment£/conf/tds-site/settings/wcm/templates/xf-web-variation#/conf/techdata/settings/wcm/templates/xf-web-variation£/conf/tds-site/settings/wcm/templates/apac-dcp-page#/conf/techdata/settings/wcm/templates/apac-dcp-page£/conf/tds-site/settings/wcm/templates/td-header-xf#/conf/techdata/settings/wcm/templates/td-header-xf£/conf/tds-site/settings/wcm/templates/tds-header-xf#/conf/techdata/settings/wcm/templates/td-header-xf£/conf/tds-site/tds-site-americas/americas-header-xf#/conf/techdata/settings/wcm/templates/td-header-xf£/conf/tds-site/tds-site-europe/settings/wcm/templates/eu-header-xf#/conf/techdata/settings/wcm/templates/td-header-xf£/conf/tds-site/settings/wcm/templates/td-footer-xf#/conf/techdata/settings/wcm/templates/td-footer-xf£/conf/tds-site/settings/wcm/templates/tds-footer-xf#/conf/techdata/settings/wcm/templates/td-footer-xf£/conf/tds-site/tds-site-americas/settings/wcm/templates/americas-footer-xf#/conf/techdata/settings/wcm/templates/td-footer-xf£/conf/tds-site/tds-site-europe/settings/wcm/templates/eu-footer-xf#/conf/techdata/settings/wcm/templates/td-footer-xf£/conf/tds-site/tds-site-apj/settings/wcm/templates/apac-dcp-page#/conf/techdata/techdata-apac/settings/wcm/templates/apac-dcp-page£/conf/tds-site/tds-site-europe/settings/wcm/templates/eu-dcp-page#/conf/techdata/settings/wcm/templates/td-dcp-page£/conf/tds-site/tds-site-americas/settings/wcm/templates/americas-dcp-page#/conf/techdata/settings/wcm/templates/td-dcp-page£/conf/tds-site/tds-site-europe/settings/wcm/templates/intouch-page#/conf/techdata/settings/wcm/templates/intouch-page-template£/conf/tds-site/tds-site-europe/settings/wcm/templates/eu-dcp-page#/conf/techdata/settings/wcm/templates/td-eu-dcp-page"

getPage(rootPath).recurse { page ->
    def content = page.node

    if (content) {

        // update properties on the page jcr:content
        // sling:resourceType
        def resourceTypeValue = content.get("sling:resourceType")
        if (resourceTypeValue && resourceTypeValue.contains(sourceResourcePath)) {
            content.set("sling:resourceType", resourceTypeValue.replace(sourceResourcePath, targetResourcePath))
        }

        // cq:template
        def templateValue = content.get("cq:template")
        if (templateValue) {
            if (templatePathsList.contains(templateValue)) {

                // "/conf/tds-site/src-path1#/conf/techdata/des-path1£/conf/techdata/src-path2#/conf/tds-site/des-path2"
                def templateSplitStrings = templatePathsList.split("£")
                for (item in templateSplitStrings) {

                    // "/conf/tds-site/src-path1#/conf/techdata/des-path1
                    def templatesBothPaths = item.split("#")
                    if (templatesBothPaths[0].contains(templateValue)) {
                        content.set("cq:template", templatesBothPaths[1])
                    }
                }
            }
        }

        // errorPages
        def errorPagesValue = content.get("errorPages")
        if (errorPagesValue && errorPagesValue.contains("techdata")) {
            content.set("errorPages", errorPagesValue.replace("/content/tds-site/", "/content/techdata/"))
        }

        // update properties inside each node
        content?.recurse { node ->

            //node resourceType
            def nodeResourceType = node.get("sling:resourceType")
            if (nodeResourceType && nodeResourceType.contains("tds-site")) {
                node.set("sling:resourceType", nodeResourceType.replace("tds-site/", "techdata/"))
            }

            //cq:master
            //def blueprintMasterValue = node.get("cq:master")
            //if (blueprintMasterValue && nodeResourceType.contains("tds-site")) {
            //  node.set("sling:resourceType", blueprintMasterValue.replace("tds-site/","techdata/"))
            //}
        }

    }
}

// save all updated properties
save()

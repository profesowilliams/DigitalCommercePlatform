package com.techdata.core.slingcaconfig;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Techdata XF JS Servlet")
public @interface ExperienceFragmentJSServletConfig {

    @AttributeDefinition(name = "JQuery Library")
    String jqueryPath() default "jquery";

    @AttributeDefinition(name = "ClientLib Categories")
    String[] clientlibCategories() default {"techdata.base", "techdata.all"};

    @AttributeDefinition(name = "Clientlib Ignore URL List")
    String[] clientlibIgnoreList() default {
        "/etc.clientlibs/clientlibs/granite/jquery.js",
        "/etc.clientlibs/clientlibs/granite/utils.js"};

    @AttributeDefinition(name = "Shop Url")
    String shopUrl() default "https://shop.techdata.com";

    @AttributeDefinition(name = "Corporate Url")
    String corporateUrl() default "http://www.techdata.com";

    @AttributeDefinition(name = "Shop Domain")
    String shopDomain() default "shop.techdata.com";

    @AttributeDefinition(name = "Corporate Domain")
    String corporateDomain() default "www.techdata.com";

    @AttributeDefinition(name = "Legacy Url")
    String legacyUrl() default "https://www.techdata.com";

    @AttributeDefinition(name = "Type Ahead Url")
    String typeAheadUrl() default "https://typeahead.techdata.com";

    @AttributeDefinition(name = "Legacy Domain")
    String legacyDomain() default "www.techdata.com";

    @AttributeDefinition(name = "Cookie Domain")
    String cookieDomain() default ".techdata.com";

    @AttributeDefinition(name = "Tech Select Content Url")
    String techSelectContentUrl() default
            "https://shop.techdata.com/siteredirect/?referrer=shop.techdata.com&destination=http://content.techselect.techdata.com&authPage=login.aspx&landingPage=http://content.techselect.techdata.com";

    @AttributeDefinition(name = "My Order Tracking Url")
    String myOrderTrackerUrl() default
            "https://shop.techdata.com/siteredirect/?referrer=shop.techdata.com&destination=https://www.myordertracker.com&authPage=/us/default.aspx&landingPage=https://www.myordertracker.com/reseller/MyOrderTracker.aspx";

    @AttributeDefinition(name = "Debug")
    String debug() default "false";

    @AttributeDefinition(name = "Debug Tracking Events")
    String debugTrackingEvents() default "false";

    @AttributeDefinition(name = "Uber Search Enabled")
    String uberSearchEnabled() default "true";

}

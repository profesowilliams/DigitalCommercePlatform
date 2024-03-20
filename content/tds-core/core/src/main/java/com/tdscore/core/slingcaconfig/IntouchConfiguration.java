package com.tdscore.core.slingcaconfig;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

@Configuration(
        label = "Intouch Configuration",
        description = "Configuration can be made per website")
public @interface IntouchConfiguration {

    @Property(label = "CSS API Url", description = "API url that provides the CSS urls.")
    String cssAPIUrl() default "https://intouch.integration.tdsynnex.com/InTouch/MVC/Header/CSS";

    @Property(label = "JS API Url", description = "API url that provides the JS urls.")
    String jsAPIUrl() default "https://intouch.integration.tdsynnex.com/InTouch/MVC/Header/JS";

    @Property(label = "GTM API Url", description = "API url that provides the GTM urls.")
    String gtmAPIUrl() default "https://intouch.integration.tdsynnex.com/InTouch/MVC/Header/GoogleTagManager";

    @Property(label = "Header API Url", description = "API url that provides the Header HTML Fragment.")
    String headerAPIUrl() default "https://intouch.integration.tdsynnex.com/InTouch/MVC/Header";

    @Property(label = "Footer API Url", description = "API url that provides the Footer HTML Fragment.")
    String footerAPIUrl() default "https://intouch.integration.tdsynnex.com/InTouch/MVC/Footer";

    @Property(label = "User Validation API Url", description = "API url that provides user validation (based on SWATpass cookie).")
    String userCheckAPIUrl() default "https://intouch.integration.tdsynnex.com/InTouch/MVC/api/User/Check?continueUrl=";

    @Property(label = "Enable Intouch Login", description = "Enable Intouch Login")
    boolean enableIntouchLogin() default false;
}

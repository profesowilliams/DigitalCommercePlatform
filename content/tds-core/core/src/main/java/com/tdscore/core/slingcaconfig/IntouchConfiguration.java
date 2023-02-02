package com.tdscore.core.slingcaconfig;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

@Configuration(
        label = "Intouch Configuration",
        description = "Configuration can be made per website")
public @interface IntouchConfiguration {

    @Property(label = "CSS API Url", description = "API url that provides the CSS urls.")
    String cssAPIUrl() default "https://westeu-sit-ui.dc.tdebusiness.cloud/ui-intouch/v1/CSS";

    @Property(label = "JS API Url", description = "API url that provides the JS urls.")
    String jsAPIUrl() default "https://westeu-sit-ui.dc.tdebusiness.cloud/ui-intouch/v1/JS";

    @Property(label = "Header API Url", description = "API url that provides the Header HTML Fragment.")
    String headerAPIUrl() default "https://intouch.integration.tdsynnex.com/InTouch/MVC/Header";

    @Property(label = "Footer API Url", description = "API url that provides the Footer HTML Fragment.")
    String footerAPIUrl() default "https://intouch.integration.tdsynnex.com/InTouch/MVC/Footer";
}

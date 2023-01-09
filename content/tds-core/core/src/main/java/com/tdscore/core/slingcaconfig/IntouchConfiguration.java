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
    String headerAPIUrl() default "https://westeu-sit-ui.dc.tdebusiness.cloud/ui-intouch/v1/Header";

    @Property(label = "Footer API Url", description = "API url that provides the Footer HTML Fragment.")
    String footerAPIUrl() default "https://westeu-sit-ui.dc.tdebusiness.cloud/ui-intouch/v1/Footer";

    @Property(label = "Background Login Enabled", description = "Flag to enable or disable")
    boolean backgroundLoginEnabled() default false;

    @Property(label = "Background Login Snippet", description = "Provides script that will be embedded in Body section of the page.")
    String backgroundLoginSnippet() default
            "<iframe src=\"https://intouch.integration.tdsynnex.com/intouch/MiscFE/SSO/ServiceLogin?service=IntouchClient&SessForm=1&relogin=false&ContinueUrl=https%3a%2f%2fintouch.integration.tdsynnex.com%2fintouch%2fHome.aspx\"style=\"display:\n" +
                    "none\"></iframe>";
}

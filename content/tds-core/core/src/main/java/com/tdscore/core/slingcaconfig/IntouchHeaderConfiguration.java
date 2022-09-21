package com.tdscore.core.slingcaconfig;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

@Configuration(label = "Intouch Header/Footer Configuration", description = "API configurations for Intouch header/footer.")
public @interface IntouchHeaderConfiguration {
    
    @Property(label = "CSS API Url", description = "API url that provides the CSS urls.")
    String cssAPIUrl() default "https://eastus-dit-ui.dc.tdebusiness.cloud/ui-intouch/v1/CSS";

    @Property(label = "JS API Url", description = "API url that provides the JS urls.")
    String jsAPIUrl() default "https://eastus-dit-ui.dc.tdebusiness.cloud/ui-intouch/v1/JS";;

    @Property(label = "Header API Url", description = "API url that provides the Header HTML Fragment.")
    String headerAPIUrl() default "https://eastus-dit-ui.dc.tdebusiness.cloud/ui-intouch/v1/Header";

    @Property(label = "Footer API Url", description = "API url that provides the Footer HTML Fragment.")
    String footerAPIUrl() default "https://eastus-dit-ui.dc.tdebusiness.cloud/ui-intouch/v1/Footer";

}

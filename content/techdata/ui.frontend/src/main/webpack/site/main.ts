
// Stylesheets
import "./main.scss";

// Javascript or Typescript
import "./**/*.js";
import "./**/*.ts";
import "../common-utils/js/app.initializer";

// TODO: AEM devs to include clientlib.global.js too instead of fetching dependencies from here
import "../global/td-components/megamenu/megamenu";
import "../global/td-components/vendorlistings/vendorlistings";
import "../global/td-components/region-select/region-select";
import "../global/td-components/button/buttons";
import {Initializer} from "../global/initializer";
new Initializer();

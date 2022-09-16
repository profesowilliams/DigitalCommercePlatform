
// Stylesheets
import "./main.scss";
import $ from 'jquery';
import 'slick-carousel';

// Javascript or Typescript
import "./**/*.js";
import "./**/*.ts";
import "../common-utils/js/app.initializer";

// TODO: AEM devs to include clientlib.global.js too instead of fetching dependencies from here
import "../global/td-components/megamenu/megamenu";
import "../global/td-components/vendorlistings/vendorlistings";
import "../global/td-components/dropdownbutton/dropdownbutton";
import "../global/td-components/form-container/form-container";
import "../global/td-components/contentfragment-bio/contentfragment-bio";
import "../../../../../../tds-core/ui.frontend/src/components/languagenavigation/languagenavigation";
import "../../../../../../tds-core/ui.frontend/src/utils/text-enhancer/text-enhancer";
import "../../../../../../tds-core/ui.frontend/src/components/popup/popup";
import "../global/td-components/button/buttons";
import {Initializer} from "../global/initializer";
new Initializer();
import "../global/td-components/filmstrip-carousel/filmstrip-carousel";
import "../global/td-components/analytics/analytics-tracking";
import "../global/td-components/authentication/authentication";
import "../global/td-components/form-options/brand-filter/brandFilter";
import "../../../../../../tds-core/ui.frontend/src/components/hub/hub";


//include fortawesome library bundle
import "fortawesome/js/fontawesome"
import "fortawesome/css/all.css"
import "fortawesome/js/all"

// Stylesheets
import "./main.scss";
import $ from 'jquery';
import 'slick-carousel';

// Javascript or Typescript
import "./**/*.js";
import "./**/*.ts";
import "../common-utils/js/app.initializer";

// TODO: AEM devs to include clientlib.global.js too instead of fetching dependencies from here
import "../global/tds-core-components/megamenu/megamenu";
import "../global/tds-core-components/vendorlistings/vendorlistings";
import "../global/tds-core-components/dropdownbutton/dropdownbutton";
import "../global/tds-core-components/form-container/form-container";
import "../global/tds-core-components/contentfragment-bio/contentfragment-bio";
import "../global/tds-core-components/region-select/region-select";
import "../global/tds-core-components/button/buttons";
import {Initializer} from "../global/initializer";
new Initializer();
import "../global/tds-core-components/filmstrip-carousel/filmstrip-carousel";
import "../global/tds-core-components/analytics/analytics-tracking";
import "../global/tds-core-components/authentication/authentication";
import "../global/tds-core-components/form-options/brand-filter/brandFilter";

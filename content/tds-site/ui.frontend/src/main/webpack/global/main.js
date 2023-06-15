// TODO: font-awesome libs have a significant impact on bundle size.
// find a way to optimize this.
import "fortawesome/js/fontawesome"
import "fortawesome/css/all.css"
import "fortawesome/js/all"

import "regenerator-runtime/runtime.js";
import "../common-utils/js/app.initializer.js";

// vendors
import $ from 'jquery';
window.jQuery = $;
window.$ = $;

export default $;
import 'slick-carousel';

// Stylesheets
import "./main.scss";
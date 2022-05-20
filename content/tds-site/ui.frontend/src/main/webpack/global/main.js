// TODO: font-awesome libs have a significant impact on bundle size.
// find a way to optimize this.
import "../../../../node_modules/@fortawesome/fontawesome-free/js/fontawesome"
import "../../../../node_modules/@fortawesome/fontawesome-free/css/all.css"
import "../../../../node_modules/@fortawesome/fontawesome-free/js/all"
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
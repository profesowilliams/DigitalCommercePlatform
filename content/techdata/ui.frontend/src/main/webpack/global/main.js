import "../../../../node_modules/@fortawesome/fontawesome-free/js/fontawesome"
import "regenerator-runtime/runtime.js";
import $ from 'jquery'

// Stylesheets
import "./main.scss";

// Javascript or Typescript
import { Initializer } from "./initializer.js";

document.addEventListener('DOMContentLoaded', () => new Initializer());

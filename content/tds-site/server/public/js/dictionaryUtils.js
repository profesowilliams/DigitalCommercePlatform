/*
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2012 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 */
(function(factory) {
    "use strict";

    var g = window.Granite = window.Granite || {};
    g.Util = factory();
    window.Granite.HTTP = factory(Granite.Util, jQuery);
    window.Granite.I18n = factory(window.Granite.HTTP);
    
}(function() {
    "use strict";

    return (function() {
       
        var dicts = {};

        var contextPath = null;

        var urlPrefix = "/libs/cq/i18n/dictionary";

        var manualLocale = undefined;

        var pseudoTranslations = false;

        var self = {};

        var getDictionaryUrl = function() {
            return urlPrefix;
        };

        var patchText = function(text, snippets) {
            if (snippets) {
                if (Array.isArray(snippets)) {
                    for (var i = 0; i < snippets.length; i++) {
                        text = text.replace("{" + i + "}", snippets[i]);
                    }
                } else {
                    text = text.replace("{0}", snippets);
                }
            }
            return text;
        };

        /**
         * The default locale (en).
         * @readonly
         * @type String
         */
        self.LOCALE_DEFAULT = "en";

        /**
         * The language code for pseudo translations.
         * @readonly
         * @type String
         */
        self.PSEUDO_LANGUAGE = "zz";

        /**
         * The dictionary key for pseudo translation pattern.
         * @readonly
         * @type String
         */
        self.PSEUDO_PATTERN_KEY = "_pseudoPattern_";

        
        self.init = function(config) {
            config = config || {};
            this.setLocale(config.locale);
        };

        /**
         * Sets the current locale.
         *
         * @param {String|Function} locale The locale or a function that returns the locale as a string
         */
        self.setLocale = function(locale) {
            if (!locale) {
                return;
            }
            manualLocale = locale;
        };

        /**
         * Returns the current locale based on the priorities.
         *
         * @returns {String} The locale
         */
        self.getLocale = function() {
            if (typeof manualLocale === "function") {
                // execute function first time only and store result in currentLocale
                manualLocale = manualLocale();
            }
            return manualLocale || document.documentElement.lang || self.LOCALE_DEFAULT;
        };

        /**
         * Returns the dictionary for the specified locale. This method
         * will request the dictionary using the URL prefix, the locale,
         * and the URL suffix. If no locale is specified, the current
         * locale is used.
         *
         * @param {String} locale (optional) The locale
         * @returns {Object} The dictionary
         */
        self.getDictionary = function(locale) {
            locale = locale || self.getLocale();

            if (!dicts[locale]) {
                pseudoTranslations = locale.indexOf(self.PSEUDO_LANGUAGE) === 0;

                try {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", "http://localhost:3000" + getDictionaryUrl(), false);
                    xhr.send();

                    dicts[locale] = JSON.parse(xhr.responseText);
                } catch (e) {
                    // ignored
                }
                if (!dicts[locale]) {
                    dicts[locale] = {};
                }
            }
            return dicts[locale];
        };

        /**
         * Translates the specified text into the current language.
         *
         * @param {String} text The text to translate
         * @param {String[]} snippets The snippets replacing <code>{n}</code> (optional)
         * @param {String} note A hint for translators (optional)
         * @returns {String} The translated text
         */
        self.get = function(text, snippets, note) {
            var dict;
            var newText;
            var lookupText;

            dict = self.getDictionary();

            // note that pseudoTranslations is initialized in the getDictionary() call above
            lookupText = pseudoTranslations ? self.PSEUDO_PATTERN_KEY
                : note ? text + " ((" + note + "))"
                    : text;
            if (dict) {
                newText = dict[lookupText];
            }
            if (!newText) {
                newText = text;
            }
            if (pseudoTranslations) {
                newText = newText.replace("{string}", text).replace("{comment}", note ? note : "");
            }
            return patchText(newText, snippets);
        };        
        return self;
    }());
}));


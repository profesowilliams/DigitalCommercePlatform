(function (document, $) {
    "use strict";

    var TOGGLE_ATTRIBUTE_PREFIX = "data-toggle-";
    var MASTER_ATTRIBUTE_SUFFIX = "_master";
    var SLAVE_ATTRIBUTE_SUFFIX = "_slave";
    var DIALOG_CONTENT_SELECTOR = ".cq-dialog-content";
    var MULTI_FIELD_ITEM = ".coral3-Multifield-item";
    var dialogContentSelector = ".cmp-tabs__editor";
    var childreneditorSelector = "[data-cmp-is='childrenEditor']";


    /**
     * Build the master and slave attribute names from the toggle name.
     * @param {string} toggleName
     */
    function getAttributes(toggleName) {
        return {
            master: TOGGLE_ATTRIBUTE_PREFIX + toggleName + MASTER_ATTRIBUTE_SUFFIX,
            slave: TOGGLE_ATTRIBUTE_PREFIX + toggleName + SLAVE_ATTRIBUTE_SUFFIX
        }
    }

    /**
     * Builds the master and slave selectors from the toggle name.
     * @param {string} toggleName
     */
    function getSelectors(toggleName) {
        var attributes = getAttributes(toggleName);
        return {
            master: "[" + attributes.master + "]",
            slave: "[" + attributes.slave + "]"
        }
    }

    var toggles = [
        {
            name: "checkbox",
            updateFunction: function (master, $slaves) {

            }
        }
    ];

    toggles.forEach(function (toggle) {

        var selectors = getSelectors(toggle.name);

        // When the dialog is loaded, init all slaves
        $(document).on("foundation-contentloaded", function (e) {
            // Find the dialog
            var $dialog = $(e.target);
            if ($dialog && $dialog.length === 1) {

                // Find the toggel master
                $dialog.find(MULTI_FIELD_ITEM).each( function(){
                    var $master = $(this).find(selectors.master);
                    if ($master) {
                       if ($master.length !== 1) {
                          console.error($master.length + " masters for toggle <" + toggle + ">");
                          return;
                       }
                        if ($master.attr('value') == undefined) {
							$master.attr('value', "false");
                        }

                        // Update slaves
                        var $slaves = $(this).find('.coral-textfield-custom');
                        var isChecked = $master[0].getAttribute('value');
                        $slaves.each(function () {
                            if(isChecked == 'true') {
                                $(this).removeClass('hide');
                                $(this).parent().find('.coral3-Textfield:first').attr('readonly', 'true');
                                $(this).parent().find('.coral3-Textfield:first').addClass('textfield-readonly');
                            } else {
                                $(this).addClass('hide');
                                $(this).parent().find('.coral3-Textfield:first').removeAttr('readonly');
                                $(this).parent().find('.coral3-Textfield:first').removeClass('textfield-readonly');
                            }
                        });
                        console.log('manipulate');
                    }
                });
            }
        });

    $(document).on("dialog-loaded", function(event) {
    

        var $dialog = event.dialog;
        var $dialogContent = $dialog.find(dialogContentSelector);
        var tabsEditor = $dialogContent.length > 0 ? $dialogContent[0] : undefined;
        
        if (tabsEditor) {
            var childrenEditor = tabsEditor.querySelector(childreneditorSelector);
            childrenEditor.on("change", function (e) {
                e.preventDefault();

                // For Open In New Tab Checkbox
				let $openInNewTab = $(e.target);

                if($openInNewTab && 'coral-checkbox-tabTarget' === $openInNewTab[0].getAttribute('id')) {

                    $openInNewTab.attr('value') == "false" || !$openInNewTab.attr('value') ? $openInNewTab.attr('value', "true") : $openInNewTab.attr('value', "false");
                }

                // Find the master which was updated
                var $master = $(e.target);
                var $dialog = $master.parents(DIALOG_CONTENT_SELECTOR);
                if ($master && $master.length === 1 && $master.is(selectors.master)) {
                    $master.attr('value') == "false" ? $master.attr('value', "true") : $master.attr('value', "false");
                    // Update slaves
    
                    $master.attr('checked', "true");
                    var $slaves = $master.parents(MULTI_FIELD_ITEM).find('.coral-textfield-custom');
    
                    var isChecked = $master[0].getAttribute('value');
                    $slaves.each(function () {
                        if(isChecked == 'true') {
                            $(this).removeClass('hide');
                            $(this).parent().find('.coral3-Textfield:first').attr('readonly', 'true');
                            $(this).parent().find('.coral3-Textfield:first').addClass('textfield-readonly');
                        } else {
                            $(this).addClass('hide');
                            $(this).parent().find('.coral3-Textfield:first').removeAttr('readonly');
                            $(this).parent().find('.coral3-Textfield:first').removeClass('textfield-readonly');
                        }
                    });
                    console.log('click manipulate');
                }
            });
        }
    });
});

})(document, Granite.$);
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2019 Adobe
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/* global jQuery */
(function($) {
    "use strict";

    var selectors = {
        dialogContent: ".cmp-dialog-swatches__editor",
        edit: {
            fontColorSwatchesOnly: "[data-cmp-dialog-edit-hook='fontColorSwatchesOnly']"
        },
        policy: {
            fontColorEnabled: "[data-cmp-dialog-policy-hook='fontColorEnabled']",
            fontColorSwatchesOnly: "[data-cmp-dialog-policy-hook='fontColorSwatchesOnly']",
            fontColorAllowedSwatches: "[data-cmp-dialog-policy-hook='fontColorAllowedSwatches']"
        }
    };


    $(document).on("dialog-loaded", function(e) {
        var $dialog = e.dialog;
        var $dialogContent = $dialog.find(selectors.dialogContent);
        var dialogContent = $dialogContent.length > 0 ? $dialogContent[0] : undefined;

        if (dialogContent) {
            if (dialogContent.querySelector("[data-cmp-dialog-edit-hook]")) {
                handleEditDialog(dialogContent);
            } else if (dialogContent.querySelector("[data-cmp-dialog-policy-hook]")) {
                handlePolicyDialog(dialogContent);
            }
        }
    });

    /**
     * Binds edit dialog handling
     *
     * @param {HTMLElement} containerEditor The dialog wrapper
     */
    function handleEditDialog(containerEditor) {
		const fontColorSwatchesOnly = containerEditor.querySelectorAll(selectors.edit.fontColorSwatchesOnly);

		for (var i = 0; i < fontColorSwatchesOnly.length; i++) {
            const fontColorSwatchesOnlyVariable = fontColorSwatchesOnly[i];
            fontColorSwatchesOnlyVariable.on("coral-overlay:beforeopen.cmp-dialog-edit", function(event) {
                fontColorSwatchesOnlyVariable.off("coral-overlay:beforeopen.cmp-dialog-edit");

                // ensures the swatches overlay is displayed correctly in dialog inline mode, by aligning it bottom left of the toggle button
                var target = event.target || event.srcElement;
                target.alignAt = Coral.Overlay.align.LEFT_BOTTOM;
                target.alignMy = Coral.Overlay.align.LEFT_TOP;
            });
        }
    }

    /**
     * Binds policy dialog handling
     *
     * @param {HTMLElement} containerEditor The dialog wrapper
     */
    function handlePolicyDialog(containerEditor) {
        var fontColorEnabled = containerEditor.querySelector(selectors.policy.fontColorEnabled);
        var fontColorSwatchesOnly = containerEditor.querySelector(selectors.policy.fontColorSwatchesOnly);
        var fontColorAllowedSwatches = containerEditor.querySelector(selectors.policy.fontColorAllowedSwatches);

        if (fontColorEnabled && fontColorSwatchesOnly && fontColorAllowedSwatches) {
            var fontColorSwatchesOnlyToggleable = $(fontColorSwatchesOnly).adaptTo("foundation-toggleable");
            var fontColorAllowedSwatchesToggleable = $(fontColorAllowedSwatches.parentNode).adaptTo("foundation-toggleable");
            toggle(fontColorSwatchesOnlyToggleable, fontColorEnabled.checked);
            toggle(fontColorAllowedSwatchesToggleable, fontColorEnabled.checked);

            fontColorEnabled.on("change", function(event) {
                toggle(fontColorSwatchesOnlyToggleable, fontColorEnabled.checked);
                toggle(fontColorAllowedSwatchesToggleable, fontColorEnabled.checked);
            });
        }
    }

    function toggle(toggleable, show) {
        if (show) {
            toggleable.show();
        } else {
            toggleable.hide();
        }
    }

})(jQuery);

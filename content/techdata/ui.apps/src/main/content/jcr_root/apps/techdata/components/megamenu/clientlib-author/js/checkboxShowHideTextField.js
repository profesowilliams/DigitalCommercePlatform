(function (document, $) {
    "use strict";

    $(document).on("foundation-contentloaded", function (e) {
        checkboxShowHideHandler($(".cq-dialog-checkbox-showhide", e.target));
    });

    $(document).on("change", ".cq-dialog-checkbox-showhide", function (e) {
        checkboxShowHideHandler($(this));
    });

    function checkboxShowHideHandler(el) {
        el.each(function (i, element) {
            if ($(element).is("coral-checkbox")) {
                Coral.commons.ready(element, function (component) {
                    showHide(component, element);
                    component.on("change", function () {
                        showHide(component, element);
                    });
                });
            } else {
                var component = $(element).data("checkbox");
                if (component) {
                    showHide(component, element);
                }
            }
        })
    }

    function showHide(component, element) {
        var target = $(element).data("cqDialogCheckboxShowhideTarget");
        console.log(target);
        var $target = $(target);
        var newTarget = ".navigation-root-config";
        var $newTarget = $(newTarget);



        if (target) {
            $target.addClass("hide");
            if (component.checked) {
                $target.removeClass("hide");
            }
        }

        if (newTarget) {
            $newTarget.removeClass("hide");
            if (component.checked) {
                $newTarget.addClass("hide");
            }
        }
    }
})(document, Granite.$);
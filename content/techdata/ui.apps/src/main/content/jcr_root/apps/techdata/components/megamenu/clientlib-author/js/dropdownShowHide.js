(function(document, $) {
    "use strict";
    $(document).on("foundation-contentloaded", function(e) {
        showHideHandler($(".cq-dialog-dropdown-showhide-multival", e.target));
    });

    $(document).on("selected", ".cq-dialog-dropdown-showhide-multival", function(e) {
        showHideHandler($(this));
    });

    function showHideHandler(el) {
        el.each(function(i, element) {
            if ($(element).is("coral-select")) {
                Coral.commons.ready(element, function(component) {
                    showHide(component, element);
                    component.on("change", function() {
                        showHide(component, element);
                    });
                });
            } else {
                var component = $(element).data("select");
                if (component) {
                    showHide(component, element);
                }
            }
        })
    }

    function showHide(component, element) {
        var target = $(element).data("cqDialogDropdownShowhideMultivalTarget");
        var $target = $(target);
        var elementIndex = $(element).closest('coral-multifield-item').index();
        console.log(target);
        console.log(elementIndex);
        if (target) {
            var value;

            if (typeof component.value !== "undefined") {
                value = component.value;
            } else if (typeof component.getValue === "function") {
                value = component.getValue();
            }
            console.log(value);
            $target.each(function(index) {
                var tarIndex = $(this).closest('coral-multifield-item').index();
                console.log(tarIndex);
                if (elementIndex == tarIndex) {
                    $(this).not(".hide").addClass("hide");
                    $(this).filter(function() {
                        return $(this).data('showhidetargetvalue').replace(/ /g, '').split(',').includes(value);
                    }).removeClass("hide");
                }
            });
        }
    }

})(document, Granite.$);
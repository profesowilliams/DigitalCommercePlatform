
(function($, ns){
    
    let DIALOG_CONTENT_SELECTOR = ".cmp-honeycomb__dialog";

    let selectors = {
        childrenEditor: "data-cmp-is='childrenEditor'",
        addButton: "data-cmp-hook-childreneditor='add'",
        honeycombMaxItems: "data-cmp-dialog-honeycomb-maxitems",
        dataContainerPath : "data-container-path",
        honeycombElementsTag : "coral-multifield-item"
    }

    $(document).on("dialog-loaded", function(e) {
        let $dialog = e.dialog;
        let $componentDialog = $dialog.find(DIALOG_CONTENT_SELECTOR);
        var dialogContent = $componentDialog.length > 0 ? $componentDialog[0] : undefined;
        if(dialogContent) {
            handleEditDialog(dialogContent);
        }
    });

    function handleEditDialog(componentDialog) {
        // Get Max Items that can be added to Children Editor
        let honeyCombMaxItemsElement = componentDialog.querySelector(`[${selectors.honeycombMaxItems}]`);
        let maxItems = honeyCombMaxItemsElement.getAttribute(selectors.honeycombMaxItems);

        // Get Children Editor Panel
        let childrenEditorElement = componentDialog.querySelector(`[${selectors.childrenEditor}]`);

        Coral.commons.ready(childrenEditorElement, function() {

            // Get 'Add' Button Element
            let addButtonElement = childrenEditorElement.querySelector(`[${selectors.addButton}]`);

            // Get Children Editor Stored Editable Fields (on dialog load).
            let childrenEditorEditableFields = ns.editables.find(childrenEditorElement?.getAttribute(selectors.dataContainerPath))[0];

            let honeycombElements = childrenEditorEditableFields.getChildren();
            
            // Set initial state as disabled if number of items on load surpasses the limit set by
            if (honeycombElements.length >= maxItems) {
                addButtonElement.setAttribute('disabled');
            }

            // Add listeners to childrenEditorElement
            childrenEditorElement.on("coral-collection:add", function(e) {
                let honeycombElements = childrenEditorElement.getElementsByTagName(selectors.honeycombElementsTag);
                if (honeycombElements.length >= maxItems) {
                    addButtonElement.setAttribute('disabled');
                }
            });

            childrenEditorElement.on("coral-collection:remove", function(e) {
                let honeycombElements = childrenEditorElement.getElementsByTagName(selectors.honeycombElementsTag);
                if (honeycombElements.length < maxItems) {
                    addButtonElement.removeAttribute('disabled');
                }
            });

        });
    }
})(jQuery, Granite.author);
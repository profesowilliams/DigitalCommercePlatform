(function ($, ns) {
  const DISABLED_PROPERTY = "disabled";
  const DIALOG_CONTENT_SELECTOR = ".cmp-honeycomb__dialog";

  const selectors = {
    childrenEditor: "data-cmp-is='childrenEditor'",
    addButton: "data-cmp-hook-childreneditor='add'",
    honeycombMaxItems: "data-cmp-dialog-honeycomb-maxitems",
    dataContainerPath: "data-container-path",
    honeycombElementsTag: "coral-multifield-item",
    itemTitle: ".cmp-childreneditor__item-title",
    removeButton: ".coral3-Multifield-remove",
  };

  $(document).on("dialog-loaded", function (e) {
    const $dialog = e.dialog;
    const $componentDialog = $dialog.find(DIALOG_CONTENT_SELECTOR);
    const dialogContent =
      $componentDialog.length > 0 ? $componentDialog[0] : undefined;

    if (dialogContent) {
      disableAddButton(dialogContent);
      addMaxLengthValidation($dialog);
    }
  });

  function disableAddButton(componentDialog) {
    // Get Max Items that can be added to Children Editor
    let honeyCombMaxItemsElement = componentDialog.querySelector(
      `[${selectors.honeycombMaxItems}]`
    );
    let maxItems = honeyCombMaxItemsElement.getAttribute(
      selectors.honeycombMaxItems
    );

    // Get Children Editor Panel
    let childrenEditorElement = componentDialog.querySelector(
      `[${selectors.childrenEditor}]`
    );

    Coral.commons.ready(childrenEditorElement, function () {
      // Get 'Add' Button Element
      let addButtonElement = childrenEditorElement.querySelector(
        `[${selectors.addButton}]`
      );

      // Get Children Editor Stored Editable Fields (on dialog load).
      let childrenEditorEditableFields = ns.editables.find(
        childrenEditorElement?.getAttribute(selectors.dataContainerPath)
      )[0];

      let honeycombElements = childrenEditorEditableFields.getChildren();

      // Set initial state as disabled if number of items on load surpasses the limit set by
      if (honeycombElements.length >= maxItems) {
        addButtonElement.setAttribute(DISABLED_PROPERTY);
      }

      enableDisableRemoveButtons(honeycombElements, childrenEditorElement);

      // Add listeners to childrenEditorElement
      childrenEditorElement.on("coral-collection:add", function (e) {
        let honeycombElements = childrenEditorElement.getElementsByTagName(
          selectors.honeycombElementsTag
        );
        if (honeycombElements.length >= maxItems) {
          addButtonElement.setAttribute(DISABLED_PROPERTY);
        }

        enableDisableRemoveButtons(honeycombElements, childrenEditorElement);
      });

      childrenEditorElement.on("coral-collection:remove", function (e) {
        let honeycombElements = childrenEditorElement.getElementsByTagName(
          selectors.honeycombElementsTag
        );
        if (honeycombElements.length < maxItems) {
          addButtonElement.removeAttribute(DISABLED_PROPERTY);
        }

        enableDisableRemoveButtons(honeycombElements, childrenEditorElement);
      });
    });
  }

  function enableDisableRemoveButtons(honeycombElements, childrenEditorElement) {
    const $removeButtons = $(childrenEditorElement).find(
      selectors.removeButton
    );

    if (honeycombElements.length <= 3) {
      $removeButtons.prop(DISABLED_PROPERTY, true);
    } else {
      $removeButtons.prop(DISABLED_PROPERTY, false);
    }
  }
  function addMaxLengthValidation(componentDialog) {
    componentDialog.find(selectors.itemTitle).attr("maxlength", "10");
  }
})(jQuery, Granite.author);

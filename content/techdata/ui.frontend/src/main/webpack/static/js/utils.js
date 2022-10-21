function componentSearch(componentFilter) {
    if (!componentFilter) return;

    const componentItemsParent =  document.getElementById("componentItems");
    const componentItems = componentItemsParent ? componentItemsParent.getElementsByTagName("li") : null;
    const pageItemsParent = document.getElementById("pageItems");
    const pageItems = pageItemsParent ? pageItemsParent.getElementsByTagName("li") : null;
    const reactItemsParent = document.getElementById("reactItems");
    const reactItems = reactItemsParent ? reactItemsParent.getElementsByTagName("li") : null;
    const utilityItemsParent = document.getElementById("utilityItems");
    const utilityItems = utilityItemsParent ? utilityItemsParent.getElementsByTagName("li") : null;

    function hideShowElement(typedText, elements) {
        if (!elements) {
            return;
        }
        for( let i = 0; i < elements.length; i++)
        {
            const itemText = elements[i].innerText;
            if (typedText) {
                elements[i].hidden = itemText && !itemText.toLowerCase().includes(typedText.toLowerCase());
            }
            else {
                elements[i].hidden = false;
            }
        }
    }

    const typedText = componentFilter.value;
    if (typedText !== "") {
        hideShowElement(typedText, componentItems);
        hideShowElement(typedText, pageItems);
        hideShowElement(typedText, reactItems);
        hideShowElement(typedText, utilityItems);
    }

    componentFilter.oninput = function()
    {
        const typedText = componentFilter.value;

        hideShowElement(typedText, componentItems);
        hideShowElement(typedText, pageItems);
        hideShowElement(typedText, reactItems);
        hideShowElement(typedText, utilityItems);

    };
}

window.onload = () => {
    const componentFilter = document.getElementById("componentPageFilter");
    componentFilter && componentFilter.focus();
    componentSearch(componentFilter)
};

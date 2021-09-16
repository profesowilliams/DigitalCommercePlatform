const componentFilter = document.getElementById("componentPageFilter");

if (componentFilter) {

    const componentItemsParent =  document.getElementById("componentItems");
    const componentItems = componentItemsParent ? componentItemsParent.getElementsByTagName("li") : null;
    const pageItemsParent = document.getElementById("pageItems");
    const pageItems = pageItemsParent ? pageItemsParent.getElementsByTagName("li") : null;

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

    componentFilter.oninput = function()
    {
        const typedText = componentFilter.value;

        hideShowElement(typedText, componentItems);
        hideShowElement(typedText, pageItems);

    };

    window.onload = () => {

        componentFilter.focus();

    };
}

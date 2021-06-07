let componentFilter = document.getElementById("componentPageFilter");
let componentItemsParent =  document.getElementById("componentItems");
let componentItems = componentItemsParent.getElementsByTagName("li");
let pageItemsParent = document.getElementById("pageItems");
let pageItems = pageItemsParent.getElementsByTagName("li");


componentFilter.oninput = function(event)
{
    let typedText = componentFilter.value;
    for( let i = 0; i < componentItems.length; i++)
    {
        let itemText = componentItems[i].innerText;
        if (typedText) {
            if (itemText && !itemText.toLowerCase().includes(typedText.toLowerCase())) {
                componentItems[i].hidden = true;
            }else{
                componentItems[i].hidden = false;
            }
        }
        else {
                componentItems[i].hidden = false;
            }
    }

    for( let i = 0; i < pageItems.length; i++)
    {
        let itemText = pageItems[i].innerText;
        if (typedText) {
            if (itemText && !itemText.toLowerCase().includes(typedText.toLowerCase())) {
                pageItems[i].hidden = true;
            }else{
                pageItems[i].hidden = false;
            }
        } else{
                pageItems[i].hidden = false;
            }

    }

}

window.onload = () => {

    componentFilter.focus();

}
(function() {
    "use strict";

    function closeAllSelect(elmnt) {
        /*a function that will close all select boxes in the document,
                              except the current select box:*/
        var arrNo = [];
        var selectItems = document.getElementsByClassName("select-items");
        var selectedItem = document.getElementsByClassName("select-selected");
        for (var i = 0; i < selectedItem.length; i++) {
            if (elmnt == selectedItem[i]) {
                arrNo.push(i)
            } else {
                selectedItem[i].classList.remove("select-arrow-active");
            }
        }
        for (var i = 0; i < selectItems.length; i++) {
            if (arrNo.indexOf(i)) {
                selectItems[i].classList.add("select-hide");
            }
        }
    }

    function bindSelectClick(selectedDivEle) {
        selectedDivEle.addEventListener("click", function(e) {
            /*when the select box is clicked, close any other select boxes,
                                    and open/close the current select box:*/
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    }

    function updateSelectedItem(selectEle, selectSiblings, $this) {
        for (var i = 0; i < selectEle.length; i++) {
            if (selectEle.options[i].innerHTML == $this.innerHTML) {
                selectEle.selectedIndex = i;
                selectSiblings.innerHTML = $this.innerHTML;
                var selectedOptions = $this.parentNode.getElementsByClassName("same-as-selected");
                for (var k = 0; k < selectedOptions.length; k++) {
                    selectedOptions[k].removeAttribute("class");
                }
                $this.setAttribute("class", "same-as-selected");
                break;
            }
        }
        selectSiblings.click();
    }

    function createOptions(selElmnt, optionList) {
        for (var j = 1; j < selElmnt.length; j++) {
            /*for each option in the original select element,
                                    create a new DIV that will act as an option item:*/
            var optionItem = document.createElement("DIV");
            optionItem.innerHTML = selElmnt.options[j].innerHTML;
            optionItem.addEventListener("click", function(e) {
                /*when an item is clicked, update the original select box,
                                            and the selected item:*/
                var selectEle = this.parentNode.parentNode.getElementsByTagName("select")[0];
                var selectSiblings = this.parentNode.previousSibling;
                updateSelectedItem(selectEle, selectSiblings, this);
            });
            optionList.appendChild(optionItem);
        }
    }

    function createCustomDropdown() {
        /*look for any elements with the class "custom-select":*/
        var dropdownEle = document.getElementsByClassName("cmp-form-options--drop-down");

        for (var i = 0; i < dropdownEle.length; i++) {
            var selElmnt = dropdownEle[i].getElementsByTagName("select")[0];
            /*for each element, create a new DIV that will act as the selected item:*/
            var selectedDiv = document.createElement("DIV");
            selectedDiv.setAttribute("class", "select-selected");
            selectedDiv.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
            dropdownEle[i].appendChild(selectedDiv);
            /*for each element, create a new DIV that will contain the option list:*/
            var optionList = document.createElement("DIV");
            optionList.setAttribute("class", "select-items select-hide");

            createOptions(selElmnt, optionList);
            dropdownEle[i].appendChild(optionList);
            bindSelectClick(selectedDiv);
        }
        /*if the user clicks anywhere outside the select box,
                        then close all select boxes:*/
        document.addEventListener("click", closeAllSelect);
    }

    function onDocumentReady() {
        const formElems = document.querySelectorAll('.form-style-container .cmp-form');
        if (formElems) {
            formElems && formElems.forEach(formElem => {
                formElem && formElem.querySelectorAll('input, select,textarea').forEach(elem => {
                    if (elem.closest('.cmp-form-text') && elem.closest('.cmp-form-text').querySelector('label')) {
                        const labelText = elem.closest('.cmp-form-text').querySelector('label').innerText;
                    } else if (elem.closest('.cmp-form-options') && elem.closest('.cmp-form-options').querySelector('label')) {
                        const labelText = elem.closest('.cmp-form-options').querySelector('label').innerText;
                        const tag = document.createElement("option");
                        const text = document.createTextNode(labelText);
                        tag.setAttribute('value', '');
                        tag.setAttribute('selected', '');
                        tag.setAttribute('hidden', '');
                        tag.setAttribute('disabled', '');
                        tag.appendChild(text);
                        elem.prepend(tag);
                    }
                });
            });

            createCustomDropdown();
        }

    };
    document.addEventListener("DOMContentLoaded", onDocumentReady);
})();

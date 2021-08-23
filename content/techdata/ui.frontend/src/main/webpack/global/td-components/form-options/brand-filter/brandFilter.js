(
    function()
    {

        const FILTER_SOLUTION_DROPDOWN_COMPONENT_ID = "#brand-filter-dropdown";
        const BRAND_LIST_ID = "#brand-icon-list";

        function showHideList(value) {

            let parentULElement = document.querySelectorAll(BRAND_LIST_ID);

            if (parentULElement.length > 0 ) {
                let liChildren = parentULElement[0].getElementsByTagName("li");

                for(let element of liChildren) {
                    let articleElement = element.getElementsByTagName("article");
                    if (value == "all")
                    {
                        element.style.display="list-item";
                    }else if (articleElement.length>0) {
                        let dataFilterValue = articleElement[0].dataset.filterList;
                        if ( dataFilterValue && dataFilterValue.includes(value)) {
                            element.style.display="list-item";
                        }else{
                            element.style.display="none";
                        }
                    }
                }

            }


        }

        function bootstrapFilterAction(){

            let dropDownFilterComponent = document.querySelectorAll(FILTER_SOLUTION_DROPDOWN_COMPONENT_ID);

            if (!dropDownFilterComponent || dropDownFilterComponent === undefined || dropDownFilterComponent.length == 0) {
                return;
            }else if (dropDownFilterComponent.length > 1) {
                console.error(`More than one ID found for id ${FILTER_SOLUTION_DROPDOWN_COMPONENT_ID}` );
                return;
            }

            if (dropDownFilterComponent)
            {
                let dropDownFilterElement = dropDownFilterComponent[0];

                if (!dropDownFilterElement || dropDownFilterElement.length < 1) {
                    console.error("could not find the dropdown item");
                    return;
                }
                dropDownFilterElement.addEventListener("change", function() {
                    let selectedCategory = this.selectedOptions[0].value;
                    let selectedIndex = this.selectedOptions[0].index;
                    // if first index selected, then ignore
                    if (selectedIndex != 0)
                    {
                        showHideList(selectedCategory);
                    }else{
                        showHideList("all");
                    }
                    console.log(selectedIndex);
                })

            }

        }

        if (document.readyState !== "loading") {
            bootstrapFilterAction();
        } else {
            document.addEventListener("DOMContentLoaded", bootstrapFilterAction);
        }
})();
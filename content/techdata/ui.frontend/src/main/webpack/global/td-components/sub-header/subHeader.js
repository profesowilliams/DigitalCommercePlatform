export const subHeader = () => {
    document.addEventListener("click", () => toolsToggle(event));

    function toolsToggle(event) {
        const isntMenu = event.target.nodeName === "DIV";
        const isTools = event.target.closest(`[data-tab-name]`)
        let uniqueId = isTools?.getAttribute('id');

        if (isntMenu) {
            // Search tag menu that does have class active and removed it to close the menu 
            // when clicking outside the menu and subheader
            const menu = document.getElementsByClassName('cmp-tabs__tabpanel--active cmp-tabs__tabpanel--custom-active')[0];
            menu.classList.remove("cmp-tabs__tabpanel--active", "cmp-tabs__tabpanel--custom-active");
        }

        const toolsTab = document.querySelector(`[aria-labelledby='${uniqueId}']`);

        if (!toolsTab) return;

        const isActive = toolsTab.classList.contains('cmp-tabs__tabpanel--custom-active');

        if (isActive) {
            toolsTab.classList.remove('cmp-tabs__tabpanel--custom-active');
            toolsTab.classList.remove('cmp-tabs__tabpanel--active');
        } else {
            toolsTab.classList.add('cmp-tabs__tabpanel--custom-active');
        }
    }
}


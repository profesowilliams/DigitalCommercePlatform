export const subHeader = () => {
    document.addEventListener("click", () => toolsToggle(event));

    function toolsToggle(event) {
        const isTools = event.target.closest(`[data-tab-name]`)
        if (!isTools) {
            document.querySelector(`[data-tab-parent="Tools"]`)?.classList.remove('cmp-tabs__tabpanel--custom-active');
            return;
        }

        const toolsTab = document.querySelector(`[data-tab-parent="Tools"]`);
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


export const subHeader = () => {
    document.addEventListener("click", () => toolsToggle(event));

    function toolsToggle(event) {
        let isntMenu;
        const tabClassList = event.target?.parentNode?.parentNode?.classList;
        const isSubHeader = Array.isArray(tabClassList) ? tabClassList[0] === "cmp-tabs" : "";
        const isMenu = event.target.parentNode ? event.target.parentNode.classList[0] === "cmp-tools" : false;
        const isMenuBlank = event.target.parentNode ? event.target.parentNode.classList[0] === "menucategorieslist" : false;
        if (isSubHeader || isMenu || isMenuBlank) {
            isntMenu = false;
        } else {
            isntMenu = true;
        }
        const isTools = event.target.closest(`[data-tab-name]`);
        let uniqueId = isTools?.getAttribute('id');
        if (isntMenu) {
            // Search tag menu that does have class active and removed it to close the menu 
            // when clicking outside the menu and subheader
            
            // For OLD Subheader
            const oldMenu = document.getElementsByClassName('cmp-tabs__tabpanel--active cmp-tabs__tabpanel--custom-active')[0];
            if (oldMenu) {
                oldMenu?.classList.remove("cmp-tabs__tabpanel--active", "cmp-tabs__tabpanel--custom-active");
            }

            // For New Subheader
            const newMenu = document.getElementsByClassName('menucategorieslist')[0];
            if (newMenu) {
                newMenu.style.display = "none";
            }
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

    function removeActiveClass(tabsArray) {
        for(const tab of tabsArray) {
            tab.classList.remove("cmp-tabs__tab--active");
        }
    }
    
    function isURL(href) {
        try {
            new URL(href);
        } catch (ex) {
            return false;
        }
        return true;
    }
    function getHref(href) {
        // if href contains host domain, remove it.
        let anchorRef = href;
        if(isURL(href)) {
            let url = new URL(href);
            anchorRef = url.pathname;
        }
        return anchorRef;
    }
    
    const subheaderNav = document.querySelector(".cmp-sub-header--sub-nav.new-sub");

    if (subheaderNav) {
        const subheaderTabs = subheaderNav.getElementsByClassName("cmp-tabs__tablist");
        
        const tabs =subheaderTabs[0]?.getElementsByClassName("cmp-tabs__tab") || [];
    
        const currentPagePath = subheaderNav.getAttribute("data-current-page-path") + ".html";
    
        for(const tab of tabs) {
            let anchor = tab.getElementsByTagName("a")[0];
            if(anchor) {
                let href = getHref(anchor.getAttribute("href"));

                if(currentPagePath === href || currentPagePath.endsWith(href)) {
                    removeActiveClass(tabs);
                    tab.classList.add("cmp-tabs__tab--active");
                }
            }
        }
    }
}
}

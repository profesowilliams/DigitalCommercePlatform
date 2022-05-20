import Teaser from './tds-core-components/teaser/teaser';
import TeaserDemo from './tds-core-components/teaser-demo/teaser-demo';
import LinkList from './tds-core-components/link-list/link-list';
import Tabs from './tds-core-components/tabs/tabs';
import Hamburger from './tds-core-components/hamburger-menu/hamburger';
import Header from './tds-core-components/header/header';
import MegamenuMobile from './tds-core-components/megamenu/megamenu-mobile';
import bp from '../common-utils/js/media-match';
import {subHeader} from './tds-core-components/sub-header/subHeader';

export function Initializer() {
    this.initComponents();
}

Initializer.prototype.getRoutes = () => ([
    {
        module: Teaser,
        componentId: 'teaser'
    },
    {
        module: TeaserDemo,
        componentId: 'teaser-demo'
    },
    {
        module: LinkList,
        componentId: 'link-list'
    },
    {
        module: Tabs,
        componentId: 'tabs'
    },
]);

Initializer.prototype.initComponents = function () {
    this.getRoutes().forEach(route => {
        document.querySelectorAll(`[data-component='${route.componentId}']`).forEach(el => new route.module(el));
    });

    this.manualInitComponents();
};

// manually initialized components - ones without data-component attribute
Initializer.prototype.manualInitComponents = function () {
    new Hamburger();
    new Header();
    subHeader();
    if (bp.tablet()) {
        new MegamenuMobile();
    }

    const mediaQueryList = window.matchMedia("(max-width:1023px)");


    function triggerOnMobile(mql) {
        if (mql.matches) {
            new MegamenuMobile();
        }
    }

    // triggers navigation only once when resize reach Mobile.
    mediaQueryList.addEventListener('change', triggerOnMobile);
}

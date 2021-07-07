import Teaser from './td-components/teaser/teaser';
import TeaserDemo from './td-components/teaser-demo/teaser-demo';
import LinkList from './td-components/link-list/link-list';
import Tabs from './td-components/tabs/tabs';
import Hamburger from './td-components/hamburger-menu/hamburger';
import Header from './td-components/header/header';
import MegamenuMobile from './td-components/megamenu/megamenu-mobile';
import bp from '../common-utils/js/media-match';

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
    if (bp.tablet()) {
        new MegamenuMobile();
    }
}

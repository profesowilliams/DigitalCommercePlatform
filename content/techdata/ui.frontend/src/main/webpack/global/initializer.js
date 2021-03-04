import Teaser from './td-components/teaser/teaser';
import TeaserDemo from './td-components/teaser-demo/teaser-demo';
import LinkList from './td-components/link-list/link-list';
import Tabs from './td-components/tabs/tabs';

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
    }
]);

Initializer.prototype.initComponents = function () {
    console.log("init");
    this.getRoutes().forEach(route => {
        document.querySelectorAll(`[data-component='${route.componentId}']`).forEach(el => new route.module(el));
    });
};

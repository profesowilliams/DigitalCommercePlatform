const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackHookPlugin = require("webpack-hook-plugin");

const SOURCE_ROOT = __dirname + "/src/main/webpack";

module.exports = (env) => {
    const writeToDisk = env && Boolean(env.writeToDisk);

    return merge(common, {
        entry: {
            us: SOURCE_ROOT + '/international/us/main.ts',
            global: SOURCE_ROOT + '/global/main.js',
            site: SOURCE_ROOT + '/site/main.ts',
            devOnly: SOURCE_ROOT + '/static/js/devOnly.js',
        },
        mode: "development",
        devtool: "inline-source-map",
        performance: { hints: "warning" },
        plugins: [
            new HtmlWebpackPlugin({
                filename: "dashboard.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/dashboard.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "index.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/index.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "teaser.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/teaser.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "teaser-demo.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/teaser-demo.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "link-list.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/link-list.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "teaser-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/teaser/teaser.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "teaser-demo-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/teaser-demo/teaser-demo.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "form-options-checkbox",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/form-options/checkbox.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "form-options-drop-down",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/form-options/drop-down.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "form-options-multi-select-drop-down",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/form-options/multi-select-drop-down.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "form-options-radio-button",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/form-options/radio-button.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "form-options-demo.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/form-options-demo.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "social.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/social/social.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "social-demo.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/social.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "image-demo",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/image-demo.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "image-caption-cmp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/image/image-caption.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "image-linked-cmp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/image/image-linked.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "image-standard-cmp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/image/image-standard.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "carousel-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/carousel/carousel.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "carousel-core.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/carousel/carousel-core.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "carousel-demo.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/carousel-demo.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "carousel-demo-page.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/carousel-demo-page.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "separator-demo.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/separator-demo.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "separator.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/separator/separator.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "link-list-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/link-list/link-list.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "accordion-footer.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/accordion-footer.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "accordion-footer-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/accordion-footer/accordion-footer.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "accordion-sample-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/accordion-footer/accordion-sample.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "accordion-expanded-item-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/accordion-footer/accordion-expanded-item.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "accordion-expanded-items-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/accordion-footer/accordion-expanded-items.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "accordion-single-expansion-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/accordion-footer/accordion-single-expansion.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "accordion-nested-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/accordion-footer/accordion-nested.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "list.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/list.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "tabs.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/tabs.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "tabs-demo.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/tabs-demo.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "tabs-our-purpose-demo",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/tabs-our-purpose.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "tabs-sample",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/tabs/tabs-sample.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "tabs-our-purpose",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/tabs/tabs-our-purpose.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "list-brand-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/list/brand.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "list-menu-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/list/menu.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "list-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/list/list.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "list-fixed-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/list/list-fixed.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "list-search-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/list/list-search.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "list-tags-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/list/list-tags.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "list-order-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/list/list-order.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "list-maxitems-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/list/list-maxitems.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "list-with-link-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/list/list-with-link.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "article-list-page.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/article-list-page.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "article-list-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/article-list/article-list.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "article-list-fixed-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/article-list/article-list-fixed-width.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "article-list-notitle-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/article-list/article-list-title.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "article-list-nolink-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/article-list/article-list-link.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "article-list-noheader-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/article-list/article-list-header.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "article-list-view",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/article-list-view.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "teaser-hero.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/teaser-hero.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "teaser-alert.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/teaser-hero/teaser-alert.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "text.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/text/text.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "edit-a-config.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/quotes/edit-a-config.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "my-quotes.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/quotes/my-quotes.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "top-quotes.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/quotes/top-quotes.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "my-renewals.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/quotes/my-renewals.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "Your Company Information",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/quotes/company-address-info.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "End User Information",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/quotes/end-user-info.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "td-quote-subheader",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/quotes/td-quote-subheader.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "td-quote-subtotal",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/quotes/td-quote-subtotal.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "my-deals.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/my-deals.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "my-order-status.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/my-order-status.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "sign-in.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/sign-in.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "sign-out.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/sign-out.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "text-demo.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/text-demo/text-demo.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "tabs",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/tabs/tabs.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "sub-header.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/sub-header.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "tabs-content.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/tabs/tabs-content.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "tabs-nested.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/tabs/tabs-nested.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "tabs-core-styled.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/tabs/tabs-core-styled.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "tabs-default-active.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/tabs/tabs-default-active.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "chart",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/chart-demo.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "signin",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/sign-in-demo-page.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "signin-redirect",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/sign-in-redirect.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "signin-redirect-editor.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/sign-in-redirect.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "signin-aem",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/signin/signin-aem.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "teaser-cards1.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/teaser-cards1.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "teaser-bigcards.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/teaser-bigcards.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "triptych-teaser",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/teaser/triptych-teaser.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "quadriptych-teasers",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/teaser/quadriptych-teasers.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "top-five-open-config",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/top5-config-demo.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "top-five-open-deals",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/top5-deals-demo.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "top-five-open-quotes",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/top5-quotes-demo.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "top-five-orders",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/top5-orders-demo.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "quote.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/quote.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "my-quotes-react",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/my-quotes-react.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "my-quotes.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/quotes/my-quotes-react.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "cart",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/cart/cart.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "cart-active",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/cart/cart-active.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "cart-demo",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/cart-demo.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "megamenu.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/megamenu.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "adbutler",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/megamenu/adButler.html"

                ),
            }),
            new HtmlWebpackPlugin({
                filename: "vendorlistings.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/vendorlistings.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "dropdownbutton.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/dropdownbutton.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "form-container.html",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/form-container.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "my-renewals",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/my-renewals-demo.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "search-demo",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/search.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "search",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/search/search.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "search-light-blue",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/search/search-light-blue.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "search-dark-blue",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/search/search-dark-blue.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "search-grey",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/search/search-grey.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "search-white",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/search/search-white.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "my-configurations",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/my-configurations.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "searchbar",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/searchbar.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "dropdown-menu-react",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/dropdown-menu-react.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "dropdown-menu-react-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/dropdown-menu/dropdown-menu-react.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "subtotal-react",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/subtotal-react.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "subtotal-react-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/quotes/subtotal-react.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "quotes-grid",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/quotes-grid-demo.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "white-label-grid",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/white-label-grid.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "quotes-subheader-react",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/quotes-subheader.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "quotes-subheader-react-2",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/quotes-subheader-2.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "subheader-react",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/quotes/subheader-react.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "contact-info-react",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/contact-info-react.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "contact-info-react-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/quotes/contact-info-react.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "td-quote-details-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/quotes/td-quote-details-react.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "td-order-details-comp",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/orders/td-order-details-react.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "td-quote-details-react",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/td-quote-details-react.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "td-order-details-react",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/td-order-details-react.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "gauge-chart",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/gauge-chart/gauge-chart.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "my-orders-widget-react",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/my-orders-widget-react.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "create-config",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/create-config.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "orders-grid",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/orders-grid-demo.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "modal",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/modal-demo.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "regions-list-popup",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/regions-list-popup/regions-list-popup.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "edit-config",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/edit-config.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "region-select",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT +
                        "/static/partials/region-select/region-select-dropdown.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "jump-to-top",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/buttons/jump-to-top.html"

                ),
            }),
            new HtmlWebpackPlugin({
                filename: "filmstrip-slider",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/carousel/filmstrip-slider.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "hamburger-menu",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/hamburger-menu.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "logos-layout",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/logos/logos-layout.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "about-us",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/partials/teaser-card/about-us.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "quote-preview",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/quote-preview-demo.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "new-list",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/list-new.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "analytics",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/analytics-demo-page.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "configuration-grid",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/configuration-grid.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "quote-details-pdf-demo",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/quote-details-pdf.html"
                ),
            }),
            new HtmlWebpackPlugin({
                filename: "order-details-demo",
                template: path.resolve(
                    __dirname,
                    SOURCE_ROOT + "/static/order-details.html"
                ),
            }),
        ],
        devServer: {
            inline: true,
            proxy: [
                {
                    context: ["/content", "/etc.clientlibs"],
                    target: "http://localhost:4502",
                },
            ],
            writeToDisk,
            liveReload: !writeToDisk,
        },
    });
};

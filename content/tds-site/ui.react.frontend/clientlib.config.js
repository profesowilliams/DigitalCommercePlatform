const path = require('path');

const BUILD_DIR = __dirname;
const CLIENTLIB_DIR = path.join(
    __dirname,
    '..',
    'ui.apps',
    'src',
    'main',
    'content',
    'jcr_root',
    'apps',
    'tds-site',
    'clientlibs'
);

const libsBaseConfig = {
    allowProxy: true,
    serializationFormat: 'xml',
    cssProcessor: ['default:none', 'min:none'],
    jsProcessor: ['default:none', 'min:none']
};

module.exports = {
    context: BUILD_DIR,
    clientLibRoot: CLIENTLIB_DIR,
    libs: [
        {
            ...libsBaseConfig,
            name: "clientlib-react",
            categories: ["tds-site.react"],
            dependencies: ["granite.utils"],
            assets: {
                js: [
                    "dist/**/*.js"
                ],
                css: [
                    "dist/**/*.css"
                ]
            }
        }//,
        //{
        //    ...libsBaseConfig,
        //    name: "clientlib-react-ordertracking",
        //    categories: ["tds-site.react"],
        //    dependencies: ["granite.utils"],
        //    embed: ['core.wcm.components.ordertrackinggrid.v1', 'core.wcm.components.orderstrackingdetail.v1'],
        //    assets: {
        //        js: [
        //            "dist/**/*.js"
        //        ],
        //        css: [
        //            "dist/**/*.css"
        //        ]
        //    }
        //}
    ]
};
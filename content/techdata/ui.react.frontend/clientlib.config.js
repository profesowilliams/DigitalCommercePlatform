module.exports = {
    // default working directory (can be changed per 'cwd' in every asset option)
    context: __dirname,

    // path to the clientlib root folder (output)
    clientLibRoot: "./../ui.apps/src/main/content/jcr_root/apps/techdata/clientlibs",

    libs: {
        name: "clientlib-dcp-components",
        allowProxy: true,
        categories: ["td.react-dcp.components"],
        serializationFormat: "xml",
        jsProcessor: ["min:gcc"],
        assets: {
            js: [
                "dist/**/*.js"
            ],
            css: [
                "dist/**/*.css"
            ]
        }
    }
};

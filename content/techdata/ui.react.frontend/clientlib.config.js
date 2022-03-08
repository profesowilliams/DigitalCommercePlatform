module.exports = {
    // default working directory (can be changed per 'cwd' in every asset option)
    context: __dirname,

    // path to the clientlib root folder (output)
    clientLibRoot: "./../ui.apps/src/main/content/jcr_root/apps/techdata/clientlibs",

    libs: {
        name: "clientlib-react",
        allowProxy: true,
        categories: ["techdata.react"],
        dependencies: ["granite.utils"],
        serializationFormat: "xml",
        jsProcessor: ["min:none"],
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

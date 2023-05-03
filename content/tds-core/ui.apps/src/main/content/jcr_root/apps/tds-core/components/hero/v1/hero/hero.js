use(function () {
    var Constants = {
        FILE_REFERENCE: 'fileReference'
    };

    var imageResource = resolver.getResource(this.item.path);
     path = imageResource ? imageResource.properties.get(Constants.FILE_REFERENCE) :
    	"";
    return {
        path: path
    };
});
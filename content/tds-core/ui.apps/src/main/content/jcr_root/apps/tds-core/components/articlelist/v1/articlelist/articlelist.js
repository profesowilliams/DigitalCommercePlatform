use(function () {
    var Constants = {
        JCR_CONTENT_IMAGE: "/jcr:content/image",
        FILE: 'file',
        EXTERNAL_IMAGE_PATH: 'file/jcr:content/dam:thumbnails/dam:thumbnail_48.png',
        FILE_REFERENCE: 'fileReference',
		FILE_REFERENCE_IMAGE_PATH: '/jcr:content/renditions/original'
    };

    var imageResource = resolver.getResource(this.item.path + Constants.JCR_CONTENT_IMAGE);
    imagePath = imageResource ? imageResource.getChild(Constants.FILE) ? 
        imageResource.getChild(Constants.EXTERNAL_IMAGE_PATH).path : 
    	imageResource.properties.get(Constants.FILE_REFERENCE) + Constants.FILE_REFERENCE_IMAGE_PATH : 
    	"";
    return {
        imagePath: imagePath
    };
});
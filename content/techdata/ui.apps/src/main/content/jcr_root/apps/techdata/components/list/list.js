use(function () {
    var Constants = {
        JCR_CONTENT_IMAGE: "/jcr:content/image",
        FILE: 'file',
        EXTERNAL_IMAGE_PATH: 'file/jcr:content/dam:thumbnails/dam:thumbnail_48.png',
        FILE_REFERENCE: 'fileReference',
        FILE_REFERENCE_IMAGE_PATH: '/jcr:content/renditions/cq5dam.thumbnail.140.100.png',
        FILE_JCR_CONTENT : '/jcr:content/image/file/jcr:content',
        THUMBNAIL_FOLDER : '/jcr:content/image/file/jcr:content/dam:thumbnails'
    };

    var imageResource = resolver.getResource(this.item.path + Constants.JCR_CONTENT_IMAGE);

    if (imageResource && imageResource.getChild(Constants.THUMBNAIL_FOLDER))
    {
        var fileJcrContent = resolver.getResource(this.item.path + Constants.FILE_JCR_CONTENT);
        imagePath = imageResource.getChild(Constants.EXTERNAL_IMAGE_PATH).path
    }else if (imageResource && imageResource.getChild(Constants.FILE)) {
        imagePath = imageResource.path  + '/' + Constants.FILE;
    }else {
        imagePath = imageResource.properties.get(Constants.FILE_REFERENCE) + Constants.FILE_REFERENCE_IMAGE_PATH;
    }


    return {
        imagePath: imagePath
    };
});
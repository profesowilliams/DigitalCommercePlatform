/**
 * Retrieves the path of an image resource based on the current item's path.
 * @returns {Object} An object containing the path of the image.
 */
use(function () {
    /**
     * Constants used in the function.
     * @type {Object}
     */
    var Constants = {
        FILE_REFERENCE: 'fileReference'
    };

    // Get the image resource based on the current item's path
    var imageResource = resolver.getResource(this.item.path);

    // Retrieve the path from the image resource's properties, or set it as an empty string if not found
    var path = imageResource ? imageResource.properties.get(Constants.FILE_REFERENCE) : '';

    return {
        path: path
    };
});

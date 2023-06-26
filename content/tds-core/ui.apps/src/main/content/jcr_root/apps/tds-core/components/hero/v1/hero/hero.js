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

// Get all cmp-teaser__bottom-section--wrapper div elements
const wrapperDivs = document.querySelectorAll('.cmp-teaser__bottom-section--wrapper');

// Iterate over each wrapper div
wrapperDivs.forEach(wrapperDiv => {
    // Get the first child link element
    const link = wrapperDiv.querySelector('.cmp-teaser__bottom-section--link:first-child');

    // Add click event listener to the wrapper div
    wrapperDiv.addEventListener('click', () => {
        // Check if the first child link exists and has a href attribute
        if (link && link.href) {
            // Redirect to the link's URL
            window.location.href = link.href;
        }
    });
});

use(function () {
    var pageProps = currentPage.getContentResource();
    var isPrivatePage = pageProps.properties['isPrivatePage'];
    return {
        privatePage: isPrivatePage
    };
});
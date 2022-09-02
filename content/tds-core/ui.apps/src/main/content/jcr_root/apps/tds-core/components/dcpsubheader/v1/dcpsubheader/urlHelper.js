use(function () {
    var authoredUrl =  this.destinationPage;
    if(authoredUrl != undefined && !authoredUrl.includes('https') && !authoredUrl.includes('http') && !authoredUrl.includes('www')) {
        authoredUrl = authoredUrl + '.html';
    }
    return {
        url: authoredUrl
    };
})
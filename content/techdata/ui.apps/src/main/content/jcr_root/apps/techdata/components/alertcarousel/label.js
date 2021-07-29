use(function () {
  var title = this.title;
  var titles = title.replace(/\{([\s\S]*)\}/gim, function (match) {
    var toWrap = match.slice(1, match.length - 1);
    var wrapped = "<span class='dp-carousel__alert-button-color'>" + toWrap + "</span>";
    return wrapped;
  });

  var parsedLinkUrl = this.link ? (this.link.startsWith("http") ? this.link : this.link + ".html") : "blank";

  return {
    titles: titles,
    linkUrl: parsedLinkUrl
  };
});
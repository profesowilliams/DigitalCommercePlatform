use(function () {
  var title = this.linkTitle;
  return {
    isViewAll: title.startsWith('View all')
  };
})
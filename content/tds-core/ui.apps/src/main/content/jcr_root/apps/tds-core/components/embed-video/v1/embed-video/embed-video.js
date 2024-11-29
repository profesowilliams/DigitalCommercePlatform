"use strict";

use(function () {
  var videoType = properties.get("videoType") || "";
  var videoId = properties.get("videoId") || "";

  return {
    videoType: videoType,
    videoId: videoId
  };
});

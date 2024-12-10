"use strict";

use(function () {
  var videoType = properties.get("videoType") || "";
  var videoId = properties.get("videoId") || "";
  var safeVideoId = null;

  if (videoId !== null) {
    safeVideoId = videoId.replace('/', '');
  }

  return {
    videoType: videoType,
    videoId: videoId,
    safeVideoId: safeVideoId
  };
});

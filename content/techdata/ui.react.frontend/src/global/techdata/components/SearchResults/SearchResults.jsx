import React, { useState } from "react";
import { SearchComponent } from "@techdata/search-results";

function SearchResults(componentProp) {
  const [aemSessionId] = useState(localStorage.getItem("sessionId"));
  const {
    uiSearchBaseUrl,
    baseHref,
    uiBrowseBaseUrl,
    uiLocalizeBaseUrl,
    loginPath,
    loginRedirectUrlQueryParameter,
  } = JSON.parse(componentProp.componentProp);
  const config = {
    baseHref,
    uiSearchBaseUrl: uiSearchBaseUrl,
    uiBrowseBaseUrl,
    uiLocalizeBaseUrl,
    loginPath,
    loginRedirectUrlQueryParameter,
    sessionId: aemSessionId,
  };

  return <SearchComponent config={config} />;
}

export default SearchResults;

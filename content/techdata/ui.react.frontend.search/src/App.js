import React, { useState } from 'react'
import '../node_modules/@techdata/search-results/dist/app.css'
import { SearchComponent } from '@techdata/search-results'

function App() {
    const [aemSessionId] = useState(localStorage.getItem('sessionId'));
    const defaultConfig = {
        //baseHref: '/content/techdata/language-masters/en/about-us1.html',
        //baseHref: '/index.html',
        baseHref: '/content/tds-site/testing-branches/devs-testing-branch/dave/search-results.html',
        uiSearchBaseUrl: 'https://eastus-dit-ui.dc.tdebusiness.cloud/ui-search/v1',
        uiBrowseBaseUrl: 'https://eastus-dit-ui.dc.tdebusiness.cloud/ui-browse/v1',
        uiLocalizeBaseUrl: 'https://eastus-dit-ui.dc.tdebusiness.cloud/ui-localize/v1',
        loginPath: '/api/login',
        loginRedirectUrlQueryParameter: 'returnUrl',
        sessionId: aemSessionId,
        site: 'US'
    };

     const config = document.getElementById('root-search')?.dataset.config;
     let searchConfig = defaultConfig;
     
    if (config?.baseHref) {
        searchConfig = JSON.parse(config);        
        console.log('Using AEM configuration...');
    } else { 
        console.log('Using default configuration...');
    }

     searchConfig.sessionId = aemSessionId;
     console.log('searchConfig', searchConfig)

    return <SearchComponent config={searchConfig} />    
}

export default App
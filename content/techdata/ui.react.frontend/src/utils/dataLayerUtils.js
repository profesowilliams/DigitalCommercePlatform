/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2020 Adobe
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
let dataLayerEnabled = null;
let dataLayer = null;

export const isDataLayerEnabled = () => {
  if (dataLayerEnabled === null) {
    dataLayerEnabled = document.body.hasAttribute('data-cmp-data-layer-enabled');
  }
  return dataLayerEnabled;
};
const getDataLayer = () => {
  if (dataLayer === null) {
    dataLayer = isDataLayerEnabled() ? (window.adobeDataLayer = window.adobeDataLayer || []) : undefined;
  }
  return dataLayer;
};

// https://github.com/adobe/adobe-client-data-layer/wiki#push
export const pushData = data => {
  if (isDataLayerEnabled()) {
    getDataLayer().push(data);
  }
};

// https://github.com/adobe/adobe-client-data-layer/wiki#push
export const pushEvent = (eventName, eventInfo, extraData) => {
  if (isDataLayerEnabled()) {
    getDataLayer().push({
      event: eventName,
      clickInfo: eventInfo,
      ...extraData
    });
  }
};

// https://github.com/adobe/adobe-client-data-layer/wiki#getstate
export const getState = reference => {
  if (isDataLayerEnabled()) {
    return getDataLayer().getState(reference);
  }
  return null;
};

// https://github.com/adobe/adobe-client-data-layer/wiki#addeventlistener
export const addEventListener = (eventName, handler) => {
  if (isDataLayerEnabled()) {
    getDataLayer().addEventListener(eventName, handler);
  }
};

// https://github.com/adobe/adobe-client-data-layer/wiki#removeeventlistener
export const removeEventListener = (eventName, handler) => {
  if (isDataLayerEnabled()) {
    getDataLayer().removeEventListener(eventName, handler);
  }
};

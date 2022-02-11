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
import { getSessionId, getUserDataInitialState } from './user-utils';

let dataLayerEnabled = null;
let dataLayer = null;

let sessionId = getSessionId();
let userData = getUserDataInitialState();

const ADOBE_DATA_LAYER_CLICKINFO_EVENT = 'click';
const ADOBE_DATA_LAYER_CLICKINFO_TYPE = 'link';
const ADOBE_DATA_LAYER_CLICKINFO_NAME_CLEAR_ALL_FILTERS = 'Clear all filters';

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
    getDataLayer().push(setVisitorData(data));
  }
};

// https://github.com/adobe/adobe-client-data-layer/wiki#push
export const pushEvent = (eventName, eventInfo, extraData) => {
  if (isDataLayerEnabled()) {
    getDataLayer().push(setVisitorData({
      event: eventName,
      clickInfo: eventInfo,
      ...extraData
    }));
  }
};

// https://github.com/adobe/adobe-client-data-layer/wiki#push
/**
 * 
 * @param {{event: string, eventInfo: any}} filter 
 */
export const pushEventAnalyticsGlobal = (filter) => {
  if (isDataLayerEnabled()) {
    getDataLayer().push(setVisitorData(filter));
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

/**
 * Global funtion to handler the click event into analytics
 * for the Clear All Filters button in all the grids
 * @param {string} category 
 */
export const handlerAnalyticsClearClickEvent = (category = '') => {
  const clickInfo = {
      type : ADOBE_DATA_LAYER_CLICKINFO_TYPE,
      name : ADOBE_DATA_LAYER_CLICKINFO_NAME_CLEAR_ALL_FILTERS,
      category : category,
    };
  const objectToSend = {
    event: ADOBE_DATA_LAYER_CLICKINFO_EVENT,
    clickInfo,
  }
  pushEventAnalyticsGlobal(objectToSend);
};

// Changes made to this method would need to be replicated on the analytics-tracking.js method as well.
const setVisitorData = (object) => {

  object.page = object.page || {};

  object.page.visitor = {
    ecID: sessionId ? userData.id : null,
    sapID: sessionId ? userData.activeCustomer.customerNumber : null,
    loginStatus: sessionId ? "Logged in" : "Logged out"
  }

  return object;
}

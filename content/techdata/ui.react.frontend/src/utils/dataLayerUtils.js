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
import { getUserDataInitialState } from './user-utils';

let dataLayerEnabled = null;
let dataLayer = null;

let userIsLoggedIn = window.localStorage.getItem("sessionId");
let userData = getUserDataInitialState();

window.getSessionInfo && window.getSessionInfo().then((data) => {
  userIsLoggedIn = data[0];
  userData = data[1];
});

const ADOBE_DATA_LAYER_CLICKINFO_EVENT = 'click';
const ADOBE_DATA_LAYER_CLICKINFO_TYPE = 'link';
const ADOBE_DATA_LAYER_CLICKINFO_NAME_CLEAR_ALL_FILTERS = 'Clear all filters';

/** Please, enter here all the analytics info that are going to be used in a future, in this way, we can have it in a more structured and cleaner way */
export const ANALYTICS_TYPES = {
  events: {
    click: "click",
    editConfigStart: "editConfigStart",
    configStart: "configStart",
    configSearch: "configSearch",
    renewalSearch: "renewalSearch",
    orderDaysSelected: "orderDaysSelected",
    quoteStart: "quoteStart",
    quoteComplete: "quoteComplete",
    qpDealApply: "qpDealApply",
    qpDealSearch: "qpDealSearch",
    orderDetailsSearch: "orderDetailsSearch",
  },
  types: {
    button: "button",
    link: "link",
  },
  category: {
    renewalsTableInteraction: "Renewals Table Interactions",
    renewalsActionColumn: "Renewals Action Column",
    dcpSubheader: "DCP subheader",
    orderDetailTableInteraction: "Order Detail Table Interactions",
    profileDropdown: "profile dropdown",
    logOut: "Logout",
    logIn: "login",
    orderTableInteractions: "Orders Table Interactions",
    quotePreviewTableInteractions: "Quote Preview Table Interactions",
    quoteDetailTableInteraction: "Quote Detail Table Interactions",
  },
  name: {
    filterNumberCounter: (number) => `Filter Number ${number}`,
    collapseAll: "Collapse All",
    openAll: "Open All",
    logOut: "Logout",
    filterIcon: "Filter Icon",
    downloadPDF: "download PDF",
    downloadXLS: "download XLS",
    seeDetails: "see details",
    trackAnOrder: "Track an Order",
    logIn: "login",
    generalInformation: "General Information",
    openLineItem: "Open Line Item",
    collapseLineItem: "Collapse Line Item",
    endUserInformation: "End User Information",
    invoice: "Invoice",
    clearFilters: 'Clear all filters',
    openOrderFilterApplied: "Open Orders filter applied",
    openOrderFilterRemoved: "Open Orders filter removed",
    orderID: "Order ID",
  },
};

export const isDataLayerEnabled = () => {
  if (dataLayerEnabled === null) {
    dataLayerEnabled = document.body.hasAttribute('data-cmp-data-layer-enabled');
  }
  return dataLayerEnabled;
};
export const getDataLayer = () => {
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
export const deleteAndPushData = data => {
  if (isDataLayerEnabled()) {
    getDataLayer().pop()
    getDataLayer().push(setVisitorData(data));
  }  
};

// https://github.com/adobe/adobe-client-data-layer/wiki#push
export const pushEvent = (eventName, eventInfo, extraData) => {
  if (isDataLayerEnabled()) {
    getDataLayer().push(setVisitorData({
      event: eventName,
      ...(eventInfo && {clickInfo: eventInfo}),
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

// Changes made to this method would need to be replicated on the analytics-tracking.js method as well.
const setVisitorData = (object) => {

  object.page = object.page || {};

  object.page.visitor = {
    ecID: userIsLoggedIn && userData?.id ? userData.id : null,
    sapID: userIsLoggedIn && userData?.activeCustomer?.customerNumber ? userData.activeCustomer.customerNumber : null,
    loginStatus: userIsLoggedIn ? "Logged in" : "Logged out"
  }

  return object;
}


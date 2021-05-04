import React from 'react';
import ReactDOM from 'react-dom';

import "regenerator-runtime/runtime";
import './utils/app.connector';
import './utils/axios';

import './store/action/authAction';

import './store/store';

import './index.scss';
import Chart from "./global/techdata/components/Chart/Chart";
import SignIn from "./global/techdata/components/SignIn/SignIn";
import TopItemsBarChart from "./global/techdata/components/TopItemsBarChart/TopItemsBarChart";
import CreateQuote from "./global/techdata/components/CreateQuote/CreateQuote";
import Subheader from "./global/techdata/components/Subheader/Subheader";
import MyQuotes from "./global/techdata/components/MyQuotes/MyQuotes";
import QuotesGrid from "./global/techdata/components/Grid/Grid";
import OrdersGrid from "./global/techdata/components/OrdersGrid/OrdersGrid";

import React from "react";
import ReactDOM from "react-dom";

import "regenerator-runtime/runtime";
import "./utils/app.connector";
import "./utils/axios";

import "./store/action/authAction";

import "./store/store";

import "./index.scss";
import Chart from "./global/techdata/components/Chart/Chart";
import SignIn from "./global/techdata/components/SignIn/SignIn";
import TopItemsBarChart from "./global/techdata/components/TopItemsBarChart/TopItemsBarChart";
import CreateQuote from "./global/techdata/components/CreateQuote/CreateQuote";
import Subheader from "./global/techdata/components/Subheader/Subheader";
import MyQuotes from "./global/techdata/components/MyQuotes/MyQuotes";
import QuotesGrid from "./global/techdata/components/Grid/Grid";
import QuoteDetails from "./global/techdata/components/QuoteDetails/QuoteDetails";
import OrderDetails from "./global/techdata/components/OrderDetails/OrderDetails";
import OrdersGrid from "./global/techdata/components/OrdersGrid/OrdersGrid";
import Modal from "./global/techdata/components/Modal/Modal";
import QuotePreview from "./global/techdata/components/QuotePreview/QuotePreview";

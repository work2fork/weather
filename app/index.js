import React from "react";
import { render } from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import { requestCity, setGraphFilter, removeCity, GraphFilters } from "./actions";
import App from "./App";
import rootReducer from "./reducers";
import persistState from 'redux-localstorage'
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import "./css/weather-icons.min.css";
import "./css/style.css";

localStorage.clear();

const loggerMiddleware = createLogger();
const createPersistentStore = compose(
	persistState(),
	applyMiddleware(
		thunkMiddleware,
		loggerMiddleware
	)
)(createStore);

const store = createPersistentStore(rootReducer);

let rootElement = document.getElementById("root");
render(
	<Provider store={store}>
		<App/>
	</Provider>,
	rootElement
);
import { combineReducers } from 'redux'
import { ADD_CITY, REMOVE_CITY,
	       SET_GRAPH_FILTER, SET_ADDING_STATUS,
	       GraphFilters, AddingStatuses } from './../actions/index'
import { findIndex } from "underscore";

const { SHOW_TEMP } = GraphFilters;
const { STATUS_PENDING } = AddingStatuses;

function graphFilter(state = SHOW_TEMP, action){
	switch (action.type) {
		case "SET_GRAPH_FILTER":
			return action.filter;
		default:
			return state;
	}
}

function geo(state = {visible: false, city: ""}, action){
	switch(action.type) {
		case "SHOW_POPUP":
			return {
				visible: true,
				city: action.city
			};
		case "HIDE_POPUP":
			return {
				visible: false,
				city: state.city
			};
		default:
			return state
	}
}

function addingStatus(state = {status: STATUS_PENDING, message: ""}, action){
	switch (action.type) {
		case "SET_ADDING_STATUS":
			return {
				status: action.status,
				message: action.message
			};
		default:
			return state;
	}
}

const city = (state, action) => {
	switch (action.type) {
		case "UPDATE_CITY":
			if (state.uuid !== action.data.uuid) {
				return state;
			} else {
				return Object.assign({}, state, action.data);
			}
			return action.data;
		case "ADD_CITY":
			return action.data;
		default:
			return state;
	}
};

function cities(state = [], action){
	let index;
	switch (action.type) {
		case "ADD_CITY":
			return [
				...state, city(undefined, action)
			];
		case "UPDATE_CITY":
			index = findIndex(state, {
				uuid: action.uuid
			});
			return state.map(c => city(c, action));
		case "REMOVE_CITY":
			index = findIndex(state, {
				uuid: action.uuid
			});
			return [
				...state.slice(0, index),
				...state.slice(index + 1)
			];
		case "UPDATE_NOT_SUCCESSFUL":
			return state;
		default:
			return state;
	}
}

const rootReducer = combineReducers({
	graphFilter,
	cities,
	addingStatus,
	geo
});

export default rootReducer;
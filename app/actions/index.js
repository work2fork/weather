import fetch from 'isomorphic-fetch';
import nodeUUID from 'node-uuid';
import { findIndex } from "underscore";


/* Типы действий */

export const ADD_CITY = "ADD_CITY";
export const REMOVE_CITY = "REMOVE_CITY";
export const SET_ADDING_STATUS = "SET_ADDING_STATUS";
export const SET_GRAPH_FILTER = "SET_GRAPH_FILTER";
export const SHOW_POPUP = "SHOW_POPUP";
export const HIDE_POPUP = "HIDE_POPUP";
export const UPDATE_CITY = "UPDATE_CITY";
export const UPDATE_NOT_SUCCESSFUL = "UPDATE_NOT_SUCCESSFUL";

/* Константы фильтров */

export const GraphFilters = {
	SHOW_TEMP: "SHOW_TEMP",
	SHOW_HUMIDITY: "SHOW_HUMIDITY",
	SHOW_PRECIPITATION: "SHOW_PRECIPITATION",
	SHOW_PRESSURE: "SHOW_PRESSURE",
	SHOW_WIND: "SHOW_WIND"
};

export const AddingStatuses = {
	STATUS_PENDING: "STATUS_PENDING",
	STATUS_ERROR: "STATUS_ERROR",
	STATUS_FETCHING: "STATUS_FETCHING"
};

/* Генераторы действий */

export function setGraphFilter(filter) {
	return {
		type: "SET_GRAPH_FILTER",
		filter
	}
}

/* Автоопределение города */

export function requestGeo(city_current){
	return function(dispatch){

		return fetch("http://ip-api.com/json")
			.then(res => res.json())
			.then(json => {
				if (json.city !== city_current) {
					dispatch(showPopup(json.city));
				}
			});

	}
}

function showPopup(city){
	return {
		type: "SHOW_POPUP",
		city: city
	}
}

export function hidePopup(){
	return {
		type: "HIDE_POPUP"
	}
}

/* Манипуляции с городами */

export function requestUpdateCity(city, uuid){
	return requestCity(city, uuid, true);
}


// TODO: переделать isUpdate, костыль
export function requestCity(city, uuid, isUpdate) {
	return function (dispatch){

		// Проверка на повторную попытку добавить город
		// при наличии ошибки 429
		if (!uuid) {
			uuid = nodeUUID.v4();
			dispatch(setAddingStatus({
				status: AddingStatuses.STATUS_FETCHING,
				message: ""
			}));
		}

		let fetchString;
		if (isUpdate) {
			fetchString = `http://api.openweathermap.org/data/2.5/forecast?id=${city}&appid=a3d4a7eb011bf37d6a056745aa8dbbf5&lang=ru&units=metric&cnt=8`;
		} else {
			fetchString = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=a3d4a7eb011bf37d6a056745aa8dbbf5&lang=ru&units=metric&cnt=8`;
		}

		return fetch(fetchString)
			.then(res => {

				switch (res.status) {
					case 200:
						return res.json();
					default:
						return Promise.reject({
							code: res.status
						});
				}

			// Если ответ получен, он может быть 200 или с ошибкой
			// Как правило, ошибка только одна - 404 City Not Found
			}).then(json => {
				switch (json.cod) {

					// При успешном выполнени json.cod будет 200
					case "200":

						if (isUpdate) {
							return dispatch(updateCity(uuid, json));
						} else {
							dispatch(setAddingStatus({
								status: AddingStatuses.STATUS_PENDING,
								message: ""
							}));
							return dispatch(addCity(uuid, json));
						}

					// При любой ошибке город добавлен не будет
					default:
						if (isUpdate) {
							return {
								type: "UPDATE_NOT_SUCCESSFUL"
							}
						} else {
							return dispatch(setAddingStatus({
								status: AddingStatuses.STATUS_ERROR,
								message: "Не удалось найти указанный город"
							}));
						}
				}

			// Ответ не получен, проблема на стороне сервера, пробуем получить город заново;
			// Как правило, это происходит при ошбике 429 Too Many Requests
			}).catch(err => {
				switch (err.code) {

					// Если 429, обращаемся к API снова
					case 429:
						return dispatch(requestCity(city, uuid, isUpdate));

					// Любая другая ошибка: показываем ошибку пользователю
					default:
						if (isUpdate) {
							return {
								type: "UPDATE_NOT_SUCCESSFUL"
							}
						} else {
							return dispatch(setAddingStatus({
								status: AddingStatuses.STATUS_ERROR,
								message: "Ошибка соединения с сервером"
							}));
						}

				}
			})

	}
}


function setAddingStatus(data){
	return {
		type: "SET_ADDING_STATUS",
		status: data.status,
		message: data.message || ""
	}
}


function updateCity(uuid, json){
	let data = parseCityData(uuid, json);

	return {
		type: "UPDATE_CITY",
		data
	}
}

function addCity(uuid, json){
	let data = parseCityData(uuid, json);

	return {
		type: "ADD_CITY",
		data
	}
}

function parseCityData(uuid, json){
	return {

		/* Фиксим баг API, при котором возвращается Novaya Gollandiya, если город - СПб */
		/* Таких багов много, но для русскоязычной ЦА этот самый критичный */
		name: json.city.name == "Novaya Gollandiya" ? "Saint Petersburg" : json.city.name,
		id: json.city.id,

		graphs: json.list.map((graph, i) => {
			return {
				order: i,
				dt: graph.dt,
				dt_txt: graph.dt_txt.split(" ")[1].slice(0, 5),
				value: {

					/*  Переводим Па в мм рт ст */
					SHOW_PRESSURE: (graph.main.pressure * 0.750062).toFixed(0),
					SHOW_HUMIDITY: graph.main.humidity,
					SHOW_TEMP: parseTemp(graph.main.temp),
					SHOW_PRECIPITATION: returnPrecipitation(graph)
				},

				description: graph.weather[0].description,
				icon: graph.weather[0].icon

			}
		}),

		description: parseDesc(json.list[0].weather[0]),
		icon: parseIcon(json.list[0].weather[0].icon),
		temp: parseTemp(json.list[0].main.temp),
		wind: json.list[0].wind,
		pressure: json.list[0].main.pressure * 0.750062,
		humidity: json.list[0].main.humidity,

		uuid

	};
}

function parseDesc(desc){
	desc.description = desc.description.slice(0,1).toUpperCase() + desc.description.slice(1);
	return desc;
}

function parseTemp(temp) {
	temp = temp.toFixed(0);
	if (parseFloat(temp) <= 0) {
		return temp;
	} else {
		return "+" + temp;
	}
}

function parseIcon(icon){
	switch (icon) {
		case "01d":
			return "wi-day-sunny";
		case "01n":
			return "wi-night-clear";
		case "02d":
			return "wi-day-cloudy";
		case "02n":
			return "wi-night-alt-cloudy";
		case "03d":
		case "04d":
			return "wi-day-cloudy-high";
		case "03n":
		case "04n":
			return "wi-night-alt-cloudy-high";
		case "09d":
			return "wi-day-rain";
		case "09n":
			return "wi-night-rain";
		case "10d":
			return "wi-day-hail";
		case "10n":
			return "wi-night-alt-hail";
		case "11d":
			return "wi-day-thunderstorm";
		case "11n":
			return "wi-night-thunderstorm";
		case "13d":
			return "wi-day-snow";
		case "13n":
			return "wi-night-alt-snow-wind";
		case "50d":
			return "wi-day-fog";
		case "50n":
			return "wi-night-fog";
	}
}

export function removeCity(uuid){
	return {
		type: "REMOVE_CITY",
		uuid
	}
}

function returnPrecipitation(graph){
	try {
		return graph.rain["3h"] || 0;
	} catch (e) {
		try {
			return graph.snow["3h"] || 0;
		} catch (e) {
			return 0;
		}
	}
}
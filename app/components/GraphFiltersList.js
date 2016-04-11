import React, { Component } from "react";
import { GraphFilters } from '../actions';

export default class GraphFiltersList extends Component {
	render() {

		let Filter = {};

		for (var f in GraphFilters) {
			Filter[f] = f === this.props.filter ? "header-filter-active" : "";
		}

		return(
			<div className="header-container">
				<div
					className="header"
				>

					<div className="header-left">
						<div className="header-block">
							{getCurrentDate()}
						</div>
					</div>

					<div className="header-right">
						<div
							onClick={() => this.handleClick(GraphFilters.SHOW_TEMP)}
							className={`${Filter.SHOW_TEMP} header-block header-filter`}
						>
							Температура
						</div>
						<div
							onClick={() => this.handleClick(GraphFilters.SHOW_PRECIPITATION)}
							className={`${Filter.SHOW_PRECIPITATION} header-block header-filter`}
						>
							Осадки
						</div>
						<div
							onClick={() => this.handleClick(GraphFilters.SHOW_HUMIDITY)}
							className={`${Filter.SHOW_HUMIDITY} header-block header-filter`}
						>
							Влажность
						</div>
						<div
							onClick={() => this.handleClick(GraphFilters.SHOW_PRESSURE)}
							className={`${Filter.SHOW_PRESSURE} header-block header-filter`}
						>
							Давление
						</div>
					</div>

				</div>
			</div>
		)
	}

	handleClick(filter){
		this.props.onFilterClick(filter);
	}
}

function getCurrentDate(){
	let date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth();
	let day = date.getDate();

	switch (month) {
		case 0:
			month = 'ЯНВАРЯ';
			break;
		case 1:
			month = 'ФЕВРАЛЯ';
			break;
		case 2:
			month = 'МАРТА';
			break;
		case 3:
			month = 'АПРЕЛЯ';
			break;
		case 4:
			month = 'МАЯ';
			break;
		case 5:
			month = 'ИЮНЯ';
			break;
		case 6:
			month = 'ИЮЛЯ';
			break;
		case 7:
			month = 'АВГУСТА';
			break;
		case 8:
			month = 'СЕНТЯБРЯ';
			break;
		case 9:
			month = 'ОКТЯБРЯ';
			break;
		case 10:
			month = 'НОЯБРЯ';
			break;
		case 11:
			month = 'ДЕКАБРЯ';
			break;
	}

	return(`${day} ${month} ${year}`);
}
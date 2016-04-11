import React, { Component } from "react";
import { GraphFilters } from "../actions/index";
import Chart from "chart.js";

let FiltersArray = [];
for (let f in GraphFilters) {
	FiltersArray.push(f);
}

let chartDefaults = {
	animation: false,
	scaleLineColor: "rgba(255,255,255,1)",
	scaleFontFamily: "'CintaExtraLight', 'Helvetica', 'Arial', sans-serif",
	scaleFontSize: 12,
	scaleFontColor: "rgba(255,255,255,1)",
	tooltipFontFamily: "'CintaExtraLight', 'Helvetica', 'Arial', sans-serif",
	tooltipFontSize: 14,
	tooltipFontColor: "rgba(255,255,255,1)"
};


Chart.defaults.global = Object.assign({}, Chart.defaults.global, chartDefaults);

export default class City extends Component {

	setChart(chart, filter){
		let data = {
			labels: this.props.data.graphs.map(graph => graph.dt_txt),
			datasets: [
				{
					label: "My First dataset",
					strokeColor: "rgba(219,7,61,1)",
					pointColor: "rgba(219,7,61,1)",
					pointStrokeColor: "rgba(219,7,61,1)",
					pointHighlightFill: "rgba(219,7,61,1)",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: this.props.data.graphs.map(graph => {
						return graph.value[filter];
					})
				}
			]
		};
		let options = {
			scaleShowGridLines: true,
			scaleGridLineColor : "rgba(7,72,91,1)",
			scaleShowVerticalLines: false,
			datasetFill: false
		};
		chart.Line(data, options);
	}

	componentDidMount() {
		this.addResize();
		this.autoUpdateStart();
		this.createChart();
	}

	componentDidUpdate(){
		this.createChart();
	}

	addResize(){
		window.addEventListener("resize", () => {
			this.createChart();
		});
	}

	autoUpdateStart(){
		this.autoUpdateRequest();
		this.autoUpdateTimer = setInterval(() => {
			this.autoUpdateRequest();
		}, 1000*60*60*3);
		// обновление раз в три минуты
	}

	autoUpdateRequest(){
		this.props.cityAutoUpdate(this.props.data.id, this.props.data.uuid);
	}

	createChart(){
		var ctx, canvasParent, canvas;
		this.chart = {};
		FiltersArray.map((filter) => {

			// ty 4 chart.js
			// TODO: заменить на адекватный рисовальщик графиков, chart.js не чистит канвас .clear() и .destroy()
			canvas = document.getElementById(`${this.props.data.uuid}-${filter}`);

			if (!canvas) {
				return false;
			}

			canvasParent = canvas.parentNode;
			canvasParent.removeChild(canvas);
			canvasParent.innerHTML = `<canvas id="${this.props.data.uuid}-${filter}" width="${canvasParent.offsetWidth}" height="180"></canvas>`;
			ctx = document.getElementById(`${this.props.data.uuid}-${filter}`).getContext("2d");
			this.chart[filter] = new Chart(ctx);
			this.setChart(this.chart[filter], filter);
		});
	}

	handleRemoveClick(){
		clearInterval(this.autoUpdateTimer);

		// TODO: пофиксить или придумать что-то другое
		if (!this.closed) {
			this.props.removeCity(this.props.data.uuid);
			this.closed = true;
		}
	}

	render() {

		return (
			<li style={this.props.style}>
				<div className="city">
					<div className="city-header">
						<div className="city-header-name">
							{this.props.data.name}
						</div>
						<div className="city-header-closing">
							<div className="closing-button"
							     onClick={() => this.handleRemoveClick()}>
								x
							</div>
						</div>
					</div>

					<div className="city-data">

						<div className="city-data-left">

							<div className="city-data-left-block">
								<div className="city-data-left-block-title">
									{this.props.data.temp}
									<i className={`wi ${this.props.data.icon}`}></i>
								</div>
								<div className="city-data-left-block-desc">
									{this.props.data.description.description}
								</div>
							</div>

							<div className="city-data-left-block">
								<div className="city-data-left-block-title">
									{this.props.data.wind.speed.toFixed(0)}м/с
								</div>
								<div className="city-data-left-block-desc">
									Северо-западный
								</div>
							</div>

							<div className="city-data-left-block">
								<div className="city-data-left-block-title">
									{this.props.data.pressure.toFixed(0)}мм
								</div>
								<div className="city-data-left-block-desc">
									Давление
								</div>
							</div>

							<div className="city-data-left-block">
								<div className="city-data-left-block-title">
									{this.props.data.humidity}%
								</div>
								<div className="city-data-left-block-desc">
									Влажность
								</div>
							</div>

						</div>

						<div className={`city-data-right city-canvas-${this.props.filter}`}>

							{FiltersArray.map((filter, index) =>
								<div key={index} className={`city-data-canvas-box city-data-canvas-box-${filter}`}>
									<canvas id={`${this.props.data.uuid}-${filter}`} height="180"></canvas>
								</div>
							)}

						</div>


					</div>


				</div>
			</li>
			)
	}
}
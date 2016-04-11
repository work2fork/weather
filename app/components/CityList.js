import React, { Component } from "react";
import ReactDOM from "react-dom";
import City from "./City";
import {TransitionMotion, spring, presets} from 'react-motion';

export default class CityList extends Component {

	handleRemove(uuid) {
		this.props.removeCity(uuid);
	}

	handleCityAutoUpdate(uuid, id){
		this.props.cityAutoUpdate(uuid, id);
	}

	getDefaultStyles(){
		return this.props.cities.map(city => ({
			data: city,
			style: {
				height: 270,
				opacity: 1
			},
			key: city.uuid
		}))
	}

	getStyles(){
		return this.props.cities.map(city => ({
			data: city,
			style: {
				height: spring(270, presets.gentle),
				opacity: spring(1, presets.gentle)
			},
			key: city.uuid
		}))
	}

	willEnter() {
		return {
			height: 0,
			opacity: 0
		};
	}

	willLeave() {
		return {
			height: spring(0),
			opacity: spring(0)
		};
	}

	componentDidUpdate(){
		var node = ReactDOM.findDOMNode(this);
		node.scrollTop = node.scrollHeight;
	}

	render(){

		return(
			<TransitionMotion
				defaultStyles={this.getDefaultStyles()}
				styles={this.getStyles()}
				willLeave={this.willLeave}
				willEnter={this.willEnter}>

				{styles =>
					<ul className="city-list">
						{styles.map(city =>
							<City
								style={city.style}
								data={city.data}
								key={city.key}
								filter={this.props.filter}
								removeCity={uuid => {
						      this.handleRemove(uuid);
						    }}
							  cityAutoUpdate={(id, uuid) => {
								  this.handleCityAutoUpdate(id, uuid);
								}}

							/>
						)}
					</ul>
				}
			</TransitionMotion>
		)
	}
}


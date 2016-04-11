import React, { Component } from "react";
import { connect } from "react-redux";
import { requestCity, setGraphFilter, removeCity, requestUpdateCity, requestGeo, hidePopup } from "./actions/index";
import AddCity from "./components/AddCity";
import City from "./components/City";
import CityList from "./components/CityList";
import GraphFiltersList from "./components/GraphFiltersList";
import Geo from "./components/Geo";


class App extends Component {

	render(){
		const { dispatch, selectCities, selectGraphFilter, selectAddingStatus, geo } = this.props;

		return (
			<div>

				<Geo
					visibility={geo.visible}
				  city={geo.city}
				  requestGeo={() =>
				    dispatch(requestGeo(geo.city))
				  }
				  add={(city) => {
				    dispatch(hidePopup());
				    dispatch(requestCity(city));
				  }}
				  hide={() =>
				    dispatch(hidePopup())
				  }
				/>

				<div className="container">
					<GraphFiltersList
						onFilterClick={filter =>
							dispatch(setGraphFilter(filter))
						}
						filter={selectGraphFilter}
					/>
					<CityList
						filter={selectGraphFilter}
						cities={selectCities}
					  removeCity={uuid => {
					    dispatch(removeCity(uuid))
					  }}
					  cityAutoUpdate={(id, uuid) => {
					    dispatch(requestUpdateCity(id, uuid));
					  }}
					/>
					<AddCity
						onAddClick={city =>
							dispatch(requestCity(city))
						}
						status={selectAddingStatus.status}
					  message={selectAddingStatus.message}
					/>
					<div className="container-bg-edge"></div>
				</div>
				<div className="container-bg"></div>

			</div>
		)
	}
}

function select(state){
	return {
		selectCities: state.cities,
		selectGraphFilter: state.graphFilter,
		selectAddingStatus: state.addingStatus,
		geo: state.geo
	}
}

export default connect(select)(App);
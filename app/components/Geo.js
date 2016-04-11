import React, { Component } from "react";
import ReactDOM from "react-dom";

export default class Geo extends Component {

	componentDidMount(){
		this.props.requestGeo();
	}

	handleClosing(){
		this.props.hide();
	}

	handleAddingCity(city){
		this.props.add(city);
	}

	render(){

		return(
			<div className={`popup popup-visibility-${this.props.visibility}`}>
				<div className="popup-bg"></div>
				<div className="popup-content">
					<div className="popup-window">
						<div className="popup-closing"
							onClick={() => this.handleClosing()}
						>
							X
						</div>
						<div className="popup-window-text">
							Ваше местоположение - <span className="red-color">{this.props.city}</span>.<br/>
							Добавить его к текущим городам?
						</div>
						<div className="popup-window-answer">
							<div className="popup-window-yes"
					      onClick={() => this.handleAddingCity(this.props.city)}
							>
								Добавить
							</div>
							<div className="popup-window-no"
					      onClick={() => this.handleClosing()}
							>
								Не добавлять
							</div>
						</div>
					</div>
				</div>
			</div>
		)

	}

}
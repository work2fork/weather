import React, { Component } from "react";

export default class AddCity extends Component {
	render(){
		return(
			<div className="footer">
				<div className="footer-form">
					<div className={`footer-form-status footer-form-${this.props.status.toLowerCase()}`}>
						<div className="footer-form-status-icon footer-form-status-icon-fetching">
						</div>
					</div>
					<div className="footer-form-input-box">
						<input className="footer-form-input"
							type="city"
				      placeholder="Введите новый город..."
	            onKeyPress={(e) => this.checkEnter(e)}
							ref="input"
						/>
					</div>
					<div className="footer-form-button"
						onClick={() => this.handleClick()}
					>
						+
					</div>
				</div>

				<div className={`footer-error footer-error-${this.props.status == 'STATUS_ERROR'}`}>
					{this.props.message}
				</div>

			</div>
		)
	}

	checkEnter(e){
		e.key === "Enter" ? this.handleClick() : 0;
	}

	handleClick(){
		const node = this.refs.input;
		const text = node.value.trim();
		this.props.onAddClick(text);
		node.value = "";
	}
}
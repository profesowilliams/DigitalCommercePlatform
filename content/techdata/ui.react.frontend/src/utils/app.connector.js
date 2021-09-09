import React from 'react';
import ReactContentRenderer from 'react-dom';
import {nanoid} from 'nanoid';
import store from '../store/store';
import {Provider} from 'react-redux';

class AppConnector {
	constructor(componentProps, element) {
		const _self = this;
		this.components = [];
		this.componentProps = componentProps;

		import(`../global/techdata/components/${this.componentProps.component}/${this.componentProps.component}`)
			.then((component) => {
				_self.loadComponent(component.default, element);
			})
			.catch(() => {
				console.error(`${_self.componentProps.component} Component not found`);
			});
	}

	loadComponent(componentRef, element) {
		let Component = componentRef; // Captilize is mandatory for the variable 'Component'
		let randomKey = nanoid();
		ReactContentRenderer.render(
			<Provider store={store}>
				<Component key={randomKey} componentProp={this.componentProps.config} aemDataSet={this.componentProps} />
			</Provider>,
			element
		);
	}
}

window.AppConnector = AppConnector;

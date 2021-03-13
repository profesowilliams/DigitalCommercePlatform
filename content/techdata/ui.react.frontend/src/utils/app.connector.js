import React, {Suspense} from 'react';
import ReactContentRenderer from 'react-dom';
import {nanoid} from 'nanoid';
import store from '../store/store';
import {Provider} from 'react-redux';

class AppConnector {
	constructor(componentProps, element) {
		console.log('inside App Connector constructor');
		var _self = this;
		this.components = [];
		this.componentProps = componentProps;
		console.log(this.componentProps);

		import(`../global/techdata/components/${this.componentProps.component}/${this.componentProps.component}`)
			.then((component) => {
				_self.loadComponent(component.default, element);
			})
			.catch((error) => {
				console.error(`${_self.componentProps.component} Component not found`);
			});
	}

	loadComponent(componentRef, element) {
		console.log('load components');
		console.log(componentRef);
		console.log(' component props');
		console.log(this.componentProp);
		let Component = componentRef; // Captilize is mandatory for the variable 'Component'
		let randomKey = nanoid();
		ReactContentRenderer.render(
			<Provider store={store}>
				<Component key={randomKey} componentProp={this.componentProps.config} />
			</Provider>,
			element
		);
	}
}

window.initConfiguration = async () => {
	console.log('inside initConfig');
	/* Get the Configuration from backend on initial load */
	// await initConfig();

	// /* Get the i18n data from backend on initial load */
	// await initi18n();

	// /* Get the Anonymous token on initial load */
	// return await initAuth();
};

window.AppConnector = AppConnector;

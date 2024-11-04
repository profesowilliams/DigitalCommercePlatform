import React from "react";
import { createRoot } from "react-dom/client";
import { nanoid } from "nanoid";
import store from "../store/store";
import { Provider } from "react-redux";

function writeLog(logs, message, data) {
	logs.push({
		message: message,
		data: data,
	});
}

function parseJSON(json) {
	try {
		return JSON.parse(json);
	} catch (error) {
		return error;
	}
}

class AppConnector {
	constructor(componentProps, element) {
		this.logs = [];
		var _self = this;
		this.components = [];
		this.componentProps = componentProps;
		writeLog(this.logs, "attempting to import", {
			path: `../global/techdata/components/${this.componentProps.component}/${this.componentProps.component}`,
		});
		import(`../global/techdata/components/${this.componentProps.component}/${this.componentProps.component}`)
			.then((component) => {
				writeLog(_self.logs, "component imported", { component: component });
				_self.loadComponent(component.default, element);
			})
			.catch((error) => {
				writeLog(_self.logs, "error occurred", { error: error });
				console.error(
					`${_self.componentProps.component} not initialized successfully. Check logs below:`
				);
				console.error(_self.logs);
			});
	}

	loadComponent(componentRef, element) {
		let Component = componentRef; // Capitalize is mandatory for the variable 'Component'
		let randomKey = nanoid();
		writeLog(this.logs, "attempting to render", {
			element: element,
			componentRef: componentRef,
			componentKey: randomKey,
			aemDataSet: this.componentProps,
			componentProp: this.componentProps?.config,
			componentPropParsed: parseJSON(this.componentProps?.config),
		});
		const root = createRoot(element);
		root.render(
			<Provider store={store}>
				<Component
					key={randomKey}
					componentProp={this.componentProps.config}
					aemDataSet={this.componentProps}
				/>
			</Provider>
		);
	}
}

window.initConfiguration = async () => {
	// console.log('inside initConfig');
	/* Get the Configuration from backend on initial load */
	// await initConfig();

	// /* Get the i18n data from backend on initial load */
	// await initi18n();

	// /* Get the Anonymous token on initial load */
	// return await initAuth();
};

window.AppConnector = AppConnector;

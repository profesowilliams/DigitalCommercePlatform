import React from "react";
import ReactContentRenderer from "react-dom";
import { nanoid } from "nanoid";
import store from "../store/store";
import { Provider } from "react-redux";
import includedComponents from "../../app.config";

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

const getComponentPath = (component, isPromise=true) => {
	return isPromise ?
			import(`../global/techdata/components/${component}/${component}`)
			: `../global/techdata/components/${component}/${component}`;
}

class CommonAppConnector {
	constructor(componentProps, element) {
		this.logs = [];
		var _self = this;
		this.components = [];
		this.componentProps = componentProps;
		writeLog(
			this.logs,
			"attempting to import",
			{ path: getComponentPath(this.componentProps.component, false) }
		);

		if (includedComponents.indexOf(this.componentProps.component) !== -1) {
			getComponentPath(this.componentProps.component)
				.then((component) => {
					writeLog(_self.logs, "component imported", { component: component });
					_self.loadComponent(component.default, element);
				})
				.catch((error) => {
					writeLog(_self.logs, "error occured", { error: error });
					console.error(
						`${_self.componentProps.component} not initialized succesfully. Check logs below:`
					);
					console.error(_self.logs);
				});
		}
	}

	loadComponent(componentRef, element) {
		let Component = componentRef; // Captilize is mandatory for the variable 'Component'
		let randomKey = nanoid();
		writeLog(this.logs, "attempting to render", {
			element: element,
			componentRef: componentRef,
			componentKey: randomKey,
			aemDataSet: this.componentProps,
			componentProp: this.componentProps?.config,
			componentPropParsed: parseJSON(this.componentProps?.config),
		});
		ReactContentRenderer.render(
			<Provider store={store}>
				<Component
					key={randomKey}
					componentProp={this.componentProps.config}
					aemDataSet={this.componentProps}
				/>
			</Provider>,
			element
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
}

window.techDataUi ? window.techDataUi : (window.techDataUi = {});
window.techDataUi.CommonAppConnector = CommonAppConnector;

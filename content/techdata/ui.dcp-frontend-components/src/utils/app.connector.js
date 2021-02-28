import React, { Suspense } from 'react';
import ReactContentRenderer from 'react-dom';

class AppConnector {
    constructor(componentProps, element) {
        console.log("inside App Connector constructor");
        var _self = this;
        this.components = [];
        this.componentProps = componentProps;

        import (`../components/${this.componentProps.component}/${this.componentProps.component}`)
        .then(component => {
                _self.loadComponent(component.default, element);
            })
            .catch(error => {
                log.error(`${_self.componentProps.component} Component not found`);
            });
    }

    loadComponent(componentRef, element) {
        let Component = componentRef; // Captilize is mandatory for the variable 'Component'
        ReactContentRenderer.render(<Component componentProp = {this.componentProps} />, element);
	}
}

window.initConfiguration = async() => {

    console.log("inside initConfig");
	/* Get the Configuration from backend on initial load */
	// await initConfig();

	// /* Get the i18n data from backend on initial load */
	// await initi18n();

	// /* Get the Anonymous token on initial load */
	// return await initAuth();
}

window.AppConnector = AppConnector;
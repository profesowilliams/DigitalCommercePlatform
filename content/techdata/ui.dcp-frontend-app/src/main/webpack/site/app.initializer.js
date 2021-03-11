class AppInitializer {
    constructor() {
        var self = this;
        /*------------------------------------------------------------------
         * MutationObserver is used to listen for DOM changes
         * DOC: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver#Instance_methods
         * Performance related article : https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
         *------------------------------------------------------------------
         */

        // observe body element for mutations change
        var targetNode = document.querySelector('[data-observe-mutation]');
        console.log(targetNode);

        // Options for the observer (which mutations to observe)
        var config = {
            attributes: false,
            childList: true,
            subtree: true
        };

        // Callback function to execute when mutations are observed
        let callback = function (mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    let newNodes = mutation.addedNodes;
                    // if new nodes are added to the DOM run through initialize component code
                    if (newNodes.length) {
                        newNodes.forEach(element => {
                            self.initComponent(element);
                        });
                    }
                }
            }
        };

        if (targetNode) {
            let observer = new MutationObserver(callback);

            // Start observing on body element for configured mutations
            observer.observe(targetNode, config);
        }
        this.initAppConfiguration();
    }

    initAppConfiguration() {
        var _self = this;
        var initConfig = initConfiguration();

        initConfig.then(function () {
            _self.initComponent();
        });
    }

    initComponent(scope) {
        console.log("inside init component");
        let _scope = typeof scope == 'undefined' ? document : scope;
        let componentReferences = _scope.querySelectorAll(`[data-component]`);

        Array.prototype.forEach.call(componentReferences, function (element) {
            const componentProps = element.dataset;
            console.log("componentProps")
            console.log(componentProps)

            if ('react' === (componentProps.cmpType && componentProps.cmpType.toLowerCase())) {
                // Initialize React Component
                new AppConnector(componentProps, element);
            }
        });
    }
}

window.onload = (event) => {
    new AppInitializer();
}

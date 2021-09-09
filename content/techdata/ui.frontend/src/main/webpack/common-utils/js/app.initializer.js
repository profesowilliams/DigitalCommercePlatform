import { waitForGlobal } from './helper';
class AppInitializer {
    constructor() {
        /*------------------------------------------------------------------
         * MutationObserver is used to listen for DOM changes
         * DOC: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver#Instance_methods
         * Performance related article : https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
         *------------------------------------------------------------------
         */

        // observe body element for mutations change
        const targetNode = document.querySelector('[data-observe-mutation]');

        // Options for the observer (which mutations to observe)
        const config = {
            attributes: false,
            childList: true,
            subtree: true
        };

        // Callback function to execute when mutations are observed
        function callback(mutationsList) {
            for (const mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    const newNodes = mutation.addedNodes;
                    // if new nodes are added to the DOM run through initialize component code
                    if (newNodes.length) {
                        newNodes.forEach(element => {
                            self.initComponent(element);
                        });
                    }
                }
            }
        }

        if (targetNode) {
            const observer = new MutationObserver(callback);

            // Start observing on body element for configured mutations
            observer.observe(targetNode, config);
        }
    }

    initComponent(scope) {
        const _scope = typeof scope == 'undefined' ? document : scope;
        const componentReferences = _scope.querySelectorAll ? _scope.querySelectorAll(`[data-component]`) : [];

        Array.prototype.forEach.call(componentReferences, function (element) {
            const componentProps = element.dataset;

            if ('react' === (componentProps.cmpType && componentProps.cmpType.toLowerCase())) {
                // Initialize React Component
                new AppConnector(componentProps, element);
            }
        });
    }
}

waitForGlobal("AppConnector", function() {
    new AppInitializer();
});

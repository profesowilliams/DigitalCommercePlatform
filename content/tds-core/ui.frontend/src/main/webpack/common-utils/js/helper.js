// returns true if the element or one of its parents has the class classname
export function hasSomeParentTheClass(element, classname) {
    if (!element) return;
    if (element.className.split(' ').indexOf(classname)>=0) return true;
    return element.parentNode && hasSomeParentTheClass(element.parentNode, classname);
}

// appends newNode as sibling to referenceNode
export default function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

export function waitForGlobal (key, callback, maxIterations) {
    const iterationsLeft = maxIterations -1 || null;
    if (window[key]) {
        callback();
    } else {
        if (iterationsLeft) {
            setTimeout(function () {
                waitForGlobal(key, callback, iterationsLeft);
            }, 100);
        }
    }
}

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

// QUICK FIX TO MAKE IT WORK ON LOCAL. NEED IMPROVEMENT
export function waitForGlobal(arr, callback, maxIterations) {
    const iterationsLeft = maxIterations - 1 || null;
    if (
        window.techDataUi &&
        (window?.techDataUi[arr[0]] || window?.techDataUi[arr[1]])
    ) {
        callback();
    } else {
        if (iterationsLeft) {
            setTimeout(function () {
                waitForGlobal(arr, callback, iterationsLeft);
            }, 100);
        }
    }
}
  
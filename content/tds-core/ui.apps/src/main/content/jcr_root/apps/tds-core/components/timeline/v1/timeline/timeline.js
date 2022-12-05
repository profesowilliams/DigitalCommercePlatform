use(function () {
    var resourceResolver = resource.getResourceResolver();
    var node = resourceResolver.getResource(currentNode.getPath() + "/steps");
    var steps = null;
    var columnListValues = [];
    if (node !== null) {
        steps = node.getChildren();

        for (var [key, res] in Iterator(steps)) {
        var itemData = {};

        itemData.title = res.properties["title"];
        itemData.icon = res.properties["iconFileReference"];
        itemData.description = res.properties["description"];

        columnListValues.push(itemData);
        }
    }
    var firstStep = {
        title: properties["firstStepTitle"],
        background: properties["firstStepBackgroundImageReference"],
        divider: properties["firstStepDividerImageReference"],
    }
    var lastStep = {
        title: properties["lastStepTitle"],
        background: properties["lastStepBackgroundImageReference"],
        divider: properties["lastStepDividerImageReference"],
        icon: properties["lastStepIconImageReference"],
    }
    return {
        firstStep: firstStep,
        lastStep: lastStep,
        steps: columnListValues,
        divider: properties["stepDividerImageReference"]
    };
});
use(['./utils.js'], function (utils) {
    var resourceResolver = resource.getResourceResolver();

    var REGEX_VARIABLE_NAME = /\${[a-z-]*}/i;
    function hasVariables(text) {
        return text.search(REGEX_VARIABLE_NAME) > -1;
    }

    function getArray(crxProperty) {
        var array = new Packages.org.json.JSONArray();
        for (let index = 0; index < crxProperty.length; index++) {
            var element = crxProperty[index];
            array.put(element);
        }
        return array.toString();
    }

    function getVariableConfiguration() {
        var variableConfiguration = {};

        var node = resourceResolver.getResource(this.currentNode.getPath() + "/textProcessor");

        if (node !== null) {
            var childrenList = node.getChildren();

            for (var [key, res] in Iterator(childrenList)) {
                var itemData = {};

                itemData.variableName = res.properties["variableName"];
                itemData.text = res.properties["text"];
                itemData.color = res.properties["color"];
                itemData.animationType = res.properties["animationType"];
                if(res.properties["extraWords"] != null) {
                    itemData.extraWords = getArray(res.properties["extraWords"]);
                }

                variableConfiguration[itemData.variableName] = itemData;
            }
        }
        return variableConfiguration;
    }

    function getPlainTextObect(text) {
        var plainTextObject = {};
        plainTextObject.text = text;
        return plainTextObject;
    }

    function postProcessText(text) {
        var variableConfiguration = getVariableConfiguration();
        var textPortions = [];
        let index = 0;

        while (index < text.length) {
            var currentMatch = text.indexOf("${", index);

            if (currentMatch >= 0) {
                var possibleVarEnding = text.indexOf("}", currentMatch);

                if (possibleVarEnding > 0) {
                    var element = text.substring(currentMatch + 2, possibleVarEnding);

                    textPortions.push(getPlainTextObect(text.substring(index, currentMatch)));
                    textPortions.push(variableConfiguration[element]);
                    index = possibleVarEnding + 1;
                }
                else {
                    index = currentMatch + 1;

                    textPortions.push(getPlainTextObect(text.substring(index, currentMatch)));
                }
            }
            else {
                textPortions.push(getPlainTextObect(text.substring(index)));
                break;
            }
        }
        return textPortions;
    }

    return {
        hasVariables: hasVariables(this.text),
        textElements: postProcessText(this.text)
    };
});
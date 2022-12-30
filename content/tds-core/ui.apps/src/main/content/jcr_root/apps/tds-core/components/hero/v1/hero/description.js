use(["../common/utils.js"], function (utils) {
  var msgDebugMsg = "";
  function logger(condition, msg) {
    log.info(">>>>>>>>>>>>>>>>>>>> " + msg + " <<<<<<<<<<<<<<<<<<<<<<<");
    log.info(condition);
  }

   function delimitByEndingCharacter(htmlStr) {
    let hasEndingCharacter = htmlStr.indexOf("<p>{");
    if (hasEndingCharacter > 0) {
      return htmlStr.substring(0, hasEndingCharacter);
    }
    return htmlStr;
  }

  function extractListDesc(descriptionStr) {
    if (descriptionStr == null || descriptionStr == undefined){
      msgDebugMsg += "No body html authored"
      return false;
    }
    let result = descriptionStr
      ? descriptionStr.replace(/\\r\\n/gm, "")
      : "";
    if (!descriptionStr.includes("{item}")) {
      return false;
    }
    if (!result.includes("{item}")) {
      msgDebugMsg += "No {item} template authored"
      logger("", "no hay item configurado en el elemento");
      return result;
    }
    const splitted2 = result
      .split("<p>{item}</p>")
      .map(delimitByEndingCharacter)
      .filter((o) => o.includes("<p>"));
    return splitted2;
  }

  function extractFooterText(descriptionStr) {
    if (descriptionStr == null || descriptionStr == undefined){
      msgDebugMsg += "No body desch html authored";
      return false;
    }
    if (!descriptionStr.includes("<p>{footer}</p>")) {
      msgDebugMsg += "Does not have {footer} template";
      return false;
    }
    let result = descriptionStr
      .split("<p>{footer}</p>")
      .filter((o) => !o.includes("{item}"));
    if (Array.isArray(result)) {
      return result.join("").replace('"', "");
    } 
    return false;
  }

  var description = extractListDesc(this.description);
  var footerText = extractFooterText(this.description);
  var jsonObject = {
    description: description,
    hasDescription: Array.isArray(description),
    footerText: footerText,
    authorUsedTemplate: Array.isArray(description) && typeof footerText == 'string',
    msgDebugMsg: msgDebugMsg,
    testingDescriptionData: JSON.stringify(description)
  };
  jsonObject['test'] = JSON.stringify(jsonObject);
  logger(JSON.stringify(jsonObject),"jsonObject")
  return jsonObject;
});

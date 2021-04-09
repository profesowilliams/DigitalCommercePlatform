"use strict";
use(function () {
  function _invokeCall(method) {
    try {
      let client = new org.apache.commons.httpclient.HttpClient();
      let response = client.executeMethod(method);
      let responseBody = method.getResponseBody();
      let body = new java.lang.String(responseBody);
      method.releaseConnection();
      return body;
    }
    catch (exception) {
      java.lang.System.out.println("Exception for:" + resource.getPath());
      java.lang.System.out.println(exception);
      return "{ \"exception\": \"" + exception + "\"}";
    }
  }

  function get(apiUrl) {
    let get = new org.apache.commons.httpclient.methods.GetMethod(apiUrl);
    return _invokeCall(get)
  };

  function post(apiUrl, data) {
    let post = new org.apache.commons.httpclient.methods.PostMethod(apiUrl);
    let requestEntity = new org.apache.commons.httpclient.methods.StringRequestEntity(data, "application/json", "UTF-8");
    post.setRequestEntity(requestEntity);
    return _invokeCall(post)
  };

  return {
    get: get,
    post: post
  };
});

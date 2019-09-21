const baseURL = "url-value-to-be-given-here"
app.service("loginService", function($http, $q) {
  return ({
    userLogin: userLogin,
    getUserDetails: getUserDetails
  });

  function userLogin(userDetails) {
    var request = $http({
      method: "POST",
      url: baseURL+'/api/authenticate',
      data: {
        userDetails: userDetails
      }
    });
    return (request.then(handleSuccess, handleError));
  }

  function getUserDetails(token) {
    var request = $http({
      method: "GET",
      url: baseURL+'/api/memberinfo',
      headers: {
        Authorization: token
      }
    });
    return (request.then(handleSuccess, handleError));
  }

  function handleError(response) {
    var ret = '';
    if (!angular.isObject(response.data) || !response.data.message) {
      ret = ($q.reject("An unknown error occurred."));
    }
    if (ret.length == 0) {
      ret = ($q.reject(response.data.message));
    }
    return ret;
  }

  function handleSuccess(response) {
    return (response.data);
  }
});

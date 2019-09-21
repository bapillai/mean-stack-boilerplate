const baseURL = "url-value-to-be-given-here"
app.service("locationDataService", function($http, $q) {
  return ({
    addNewLocation: addNewLocation,
    getAllLocation: getAllLocation
  });

  function addNewLocation(locationInfo) {
    var request = $http({
      method: "POST",
      url: baseURL+'/api/location',
      data: {
        locationInfo: locationInfo
      }
    });
    return (request.then(handleSuccess, handleError));
  }

  function getAllLocation(token) {
    var request = $http({
      method: "GET",
      url: baseURL+'/api/getAllLocations',
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

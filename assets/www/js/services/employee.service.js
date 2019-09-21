const baseURL = "url-value-to-be-given-here"
app.service("employeeDataService", function($http, $q) {
  return ({
    addNewEmployee: addNewEmployee,
    getAllEmployees: getAllEmployees
  });

  function addNewEmployee(employeeInfo) {
    var request = $http({
      method: "POST",
      url: baseURL+'/api/addEmployee',
      data: {
        employeeInfo: employeeInfo
      }
    });
    return (request.then(handleSuccess, handleError));
  }

  function getAllEmployees(token) {
    var request = $http({
      method: "GET",
      url: baseURL+'/api/getAllEmployees',
      headers: {
        Authorization: token
      }
    });
    return (request.then(handleSuccess, handleError));
  }

  function getRestaurantDetails(selectedLocation) {
    var request = $http({
      method: "GET",
      url: baseURL+'/api/getRestaurantDetails',
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

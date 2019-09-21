const baseURL = "url-value-to-be-given-here"
app.service("tableDataService", function($http, $q) {
  return ({
    addNewTable: addNewTable,
    getAllTable: getAllTable
  });

  function addNewTable(tableInfo) {
    var request = $http({
      method: "POST",
      url: baseURL+'/api/tables',
      data: {
        tableInfo: tableInfo
      }
    });
    return (request.then(handleSuccess, handleError));
  }

  function getAllTable(token) {
    var request = $http({
      method: "GET",
      url: baseURL+'/api/getAllTables',
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

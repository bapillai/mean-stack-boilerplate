const baseURL = "url-value-to-be-given-here"
app.service("sectionDataService", function($http, $q) {
  return ({
    addNewSection: addNewSection,
    getAllSection: getAllSection
  });

  function addNewSection(sectionInfo) {
    var request = $http({
      method: "POST",
      url: baseURL+'/api/section',
      data: {
        sectionInfo: sectionInfo
      }
    });
    return (request.then(handleSuccess, handleError));
  }

  function getAllSection(token) {
    var request = $http({
      method: "GET",
      url: baseURL+'/api/getAllSections',
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

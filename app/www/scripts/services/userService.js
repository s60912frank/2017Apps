angular.module('2017Apps').service('UserService', ['$rootScope', '$http', function ($rootScope, $http) {
    var self = this;

    self.login = function (user, onSuccess) {
        $http.post($rootScope.iStoreUrl + '/user/login', user).
          success(function (data, status, headers, config) {
              (onSuccess || angular.noop)(data);
          }).error(function (data, status, headers, config) {
              alert("Error - Data:" + data + " status:" + status);
          });
    };

    self.register = function (user, onSuccess) {
        $http.post($rootScope.iStoreUrl + '/user', user).
          success(function (data, status, headers, config) {
              (onSuccess || angular.noop)(data);
          }).error(function (data, status, headers, config) {
              alert("Error - Data:" + data + " status:" + status);
          });
    };
}]);
angular.module('2017Web').service('AccountService', ['$rootScope', '$http', function($rootScope, $http) {
    var self = this;

    self.openAccount = function(user, onSuccess) {
        $http.post($rootScope.iStoreUrl + '/account', user).
        success(function(data, status, headers, config) {
            (onSuccess || angular.noop)(data);
        }).error(function(data, status, headers, config) {
            alert("Error - Data:" + data + " status:" + status);
        });
    };

    self.loginAccount = function(user, onSuccess) {
        $http.post($rootScope.iStoreUrl + '/account/login', user).
        success(function(data, status, headers, config) {
            (onSuccess || angular.noop)(data);
        }).error(function(data, status, headers, config) {
            alert("Error - Data:" + data + " status:" + status);
        });
    };
}]);
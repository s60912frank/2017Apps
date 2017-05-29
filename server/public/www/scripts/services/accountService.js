angular.module('2017Web').service('AccountService', ['$rootScope', '$http', function ($rootScope, $http) {
    var self = this;

    self.openAccount = function (user, onSuccess) {
        $http.post($rootScope.storeUrl + '/account', user).
            success(function (data, status, headers, config) {
                (onSuccess || angular.noop)(data);
            }).error(function (data, status, headers, config) {
                alert("Error - Data:" + data + " status:" + status);
            });
    };

    self.accountLogin = function (user, onSuccess) {
        $http.post($rootScope.storeUrl + '/account/login', user).
            success(function (data, status, headers, config) {
                (onSuccess || angular.noop)(data);
            }).error(function (data, status, headers, config) {
                alert("Error - Data:" + data + " status:" + status);
            });
    };
}]);
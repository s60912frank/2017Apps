angular.module('2017Apps').service('AccountService', ['$rootScope', '$http', function ($rootScope, $http) {
    var self = this;

    self.openAccount = function (user, onSuccess) {
        $http.post($rootScope.iStoreUrl + '/account', user).
           success(function (data, status, headers, config) {
               (onSuccess || angular.noop)(data);
           }).error(function (data, status, headers, config) {
               alert("Error - Data:" + data + " status:" + status);
           });
    };

    self.switchMode = function (userId, onSuccess) {
        $http.put($rootScope.iStoreUrl + '/account/role', userId).
          success(function (data, status, headers, config) {
              (onSuccess || angular.noop)(data);
          }).error(function (data, status, headers, config) {
              alert("Error - Data:" + data + " status:" + status);
          });
    };

    self.operation = function (account, onSuccess) {
        $http.put($rootScope.iStoreUrl + '/account', account).
        success(function (data, status, headers, config) {
            (onSuccess || angular.noop)(data);
        }).
        error(function (data, status, headers, config) {
            alert("Error - Data:" + data + " status:" + status);
        });
    };

    self.closeAccount = function (accountId, onSuccess) {
        $http.delete($rootScope.iStoreUrl + '/account/' + accountId).
        success(function (data, status, headers, config) {
            (onSuccess || angular.noop)(data);
        }).
        error(function (data, status, headers, config) {
            alert("Error - Data:" + data + " status:" + status);
        });
    };

    self.getAccounts = function (onSuccess) {
        $http.get($rootScope.iStoreUrl + '/account').
        success(function (data, status, headers, config) {
            (onSuccess || angular.noop)(data);
        }).
        error(function (data, status, headers, config) {
            alert("Error - Data:" + data + " status:" + status);
        });
    };

    self.getTransactions = function (accountId, onSuccess) {
        $http.get($rootScope.iStoreUrl + '/account/transaction/' + accountId).
        success(function (data, status, headers, config) {
            (onSuccess || angular.noop)(data);
        }).
        error(function (data, status, headers, config) {
            alert("Error - Data:" + data + " status:" + status);
        });
    };
}]);
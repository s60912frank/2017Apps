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

    self.sendMessage = function (message, onSuccess) {
        $http.post($rootScope.iStoreUrl + '/account/message', message).
           success(function (data, status, headers, config) {
               (onSuccess || angular.noop)(data);
           }).error(function (data, status, headers, config) {
               alert("Error - Data:" + data + " status:" + status);
           });
    };

    self.deposit = function (account, onSuccess) {
        $http.put($rootScope.iStoreUrl + '/account/deposit', account).
        success(function (data, status, headers, config) {
            (onSuccess || angular.noop)(data);
        }).
        error(function (data, status, headers, config) {
            alert("Error - Data:" + data + " status:" + status);
        });
    };

    self.buy = function (account, onSuccess) {
        $http.put($rootScope.iStoreUrl + '/account/buy', account).
        success(function (data, status, headers, config) {
            (onSuccess || angular.noop)(data);
        }).
        error(function (data, status, headers, config) {
            alert("Error - Data:" + data + " status:" + status);
        });
    };

    self.closeAccount = function (stroeId, accountId, onSuccess) {
        $http.delete($rootScope.iStoreUrl + '/account/' + stroeId + '/' + accountId).
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

    self.getMessages = function (accountId, onSuccess) {
        $http.get($rootScope.iStoreUrl + '/account/message/' + accountId).
          success(function (data, status, headers, config) {
              (onSuccess || angular.noop)(data);
          }).error(function (data, status, headers, config) {
              alert("Error - Data:" + data + " status:" + status);
          });
    };
}]);
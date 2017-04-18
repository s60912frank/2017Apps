angular.module('2017Apps').service('TransactionService', ['$rootScope', '$http', function ($rootScope, $http) {
    var self = this;

    self.getTransactions = function (accountId, onSuccess) {
        $http.get($rootScope.iStoreUrl + '/account/transaction/' + accountId).
        success(function (data, status, headers, config) {
            (onSuccess || angular.noop)(data);
        }).
        error(function (data, status, headers, config) {
            alert("Error - Data:" + data + " status:" + status);
        });
    }
}]);
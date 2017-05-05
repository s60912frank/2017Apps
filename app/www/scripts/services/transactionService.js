angular.module('2017Apps').service('TransactionService', ['$rootScope', '$http', function ($rootScope, $http) {
    var self = this;

    self.getTransactionList = function (userName, onSuccess) {
        $http.get($rootScope.iStoreUrl + '/transaction/' + userName).
          success(function (data, status, headers, config) {
              (onSuccess || angular.noop)(data);
          }).error(function (data, status, headers, config) {
              alert("Error - Data:" + data + " status:" + status);
          });
    };
}]);
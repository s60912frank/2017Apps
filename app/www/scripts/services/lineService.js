angular.module('2017Apps').service('LineService', ['$rootScope', '$http', function ($rootScope, $http) {
    var self = this;

    self.sendProducts = function (productIds, onSuccess) {
        $http.post($rootScope.iStoreUrl + '/line/product', productIds).
           success(function (data, status, headers, config) {
               (onSuccess || angular.noop)(data);
           }).error(function (data, status, headers, config) {
               alert("Error - Data:" + data + " status:" + status);
           });
    };

    self.sendSale = function (address, onSuccess) {
        $http.post($rootScope.iStoreUrl + '/line/location', address).
           success(function (data, status, headers, config) {
               (onSuccess || angular.noop)(data);
           }).error(function (data, status, headers, config) {
               alert("Error - Data:" + data + " status:" + status);
           });
    };
}]);
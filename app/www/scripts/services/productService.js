angular.module('2017Apps').service('ProductService', ['$rootScope', '$http', function ($rootScope, $http) {
    self = this;

    self.createProduct = function (product, onSuccess) {
        $http.post($rootScope.iStoreUrl + '/product', product).
           success(function (data, status, headers, config) {
               (onSuccess || angular.noop)(data);
           }).error(function (data, status, headers, config) {
               alert("Error - Data:" + data + " status:" + status);
           });
    };

    self.getProducts = function (onSuccess) {
        $http.get($rootScope.iStoreUrl + '/product').
        success(function (data, status, headers, config) {
            (onSuccess || angular.noop)(data);
        }).
        error(function (data, status, headers, config) {
            alert("Error - Data:" + data + " status:" + status);
        });
    };
}]);
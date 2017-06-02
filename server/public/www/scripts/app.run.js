angular.module('2017Web').run(['$rootScope', function($rootScope) {
    $rootScope.storeId = '16';
    $rootScope.storeUrl = 'https://ilab.csie.io/apps' + $rootScope.storeId + '/store';
    $rootScope.istoreUrl = 'https://ilab.csie.io/apps09/istore';
}]);
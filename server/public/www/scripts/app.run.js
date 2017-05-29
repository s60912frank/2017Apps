angular.module('2017Web').run(['$rootScope', function($rootScope) {
    $rootScope.storeId = '16';
    $rootScope.storeUrl = 'https://2bc454ef.ngrok.io/apps' + $rootScope.storeId + '/istore';
    $rootScope.istoreUrl = 'https://ilab.csie.io/apps09/istore';
}]);
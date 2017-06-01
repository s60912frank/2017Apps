angular.module('2017Web').run(['$rootScope', function($rootScope) {
    $rootScope.storeId = '16';
    $rootScope.storeUrl = 'https://43c00dbc.ngrok.io/apps' + $rootScope.storeId + '/istore';
    $rootScope.istoreUrl = 'https://ilab.csie.io/apps09/istore';
}]);
angular.module('2017Web').run(['$rootScope', function($rootScope) {
    storeId = '16';
    $rootScope.url = 'https://ilab.csie.io/apps' + storeId + '/istore';
}]);
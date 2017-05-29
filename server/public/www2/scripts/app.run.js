angular.module('2017Web').run(['$rootScope', ($rootScope) => {
    $rootScope.storeId = '16';
    $rootScope.iStoreUrl = 'https://ilab.csie.io/apps' + $rootScope.storeId + '/store';
    $rootScope.iStoreSSOURL = 'https://ilab.csie.io/apps09/istore'
}]);
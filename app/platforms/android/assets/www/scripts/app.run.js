angular.module('2017Apps').run(['$rootScope', '$ionicPlatform', 'AlertService', function($rootScope, $ionicPlatform, AlertService) {
    $rootScope.storeId = '16';
    $rootScope.iStoreSSOURL = 'https://ilab.csie.io/apps09/istore'
        //$rootScope.iStoreUrl = () => 'https://2bc454ef.ngrok.io/apps' + $rootScope.storeId + '/istore';
        //$rootScope.iStoreUrl = () => 'https://43c00dbc.ngrok.io/apps' + $rootScope.storeId + '/store';
        //$rootScope.iStoreUrl = () => 'https://ilab.csie.io/apps' + $rootScope.storeId + '/istore';
    $rootScope.iStoreUrl = () => 'https://ilab.csie.io/apps' + $rootScope.storeId + '/store';
    $rootScope.storeTopic = () => 'store' + $rootScope.storeId;

    $ionicPlatform.ready(function() {
        FCMPlugin.onNotification(function(data) {
            if (!data.wasTapped) {
                AlertService.alertPopup(data.title, data.body);
            }
        });
    });
}]);
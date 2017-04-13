angular.module('2017Apps').service('AlertService', ['$ionicPopup', function ($ionicPopup) {
    var self = this;
    self.alertPopup = function (alertMessage) {
        $ionicPopup.alert({
            title: '錯誤！',
            template: alertMessage,
            buttons: [{
                text: '確定',
                type: 'button-dark',
            }]
        })
    }
}]);
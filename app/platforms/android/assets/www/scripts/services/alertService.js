angular.module('2017Apps').service('AlertService', ['$ionicPopup', '$state', function ($ionicPopup, $state) {
    var self = this;
    self.alertPopup = function (alertMessage, state) {
        var button = { text: '確定', type: 'button-dark'};
        button.onTap = state ? function(){ $state.go(state); } : null;

        $ionicPopup.alert({
            title: state ? '帳戶作業' : '錯誤！',
            template: alertMessage,
            buttons: [button]
        })
    }
}]);
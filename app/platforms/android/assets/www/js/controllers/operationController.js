angular.module('2017Apps').controller('OperationController', ['$rootScope', '$ionicPopup', '$timeout', '$filter', 'AlertService', 'AccountService', function ($rootScope, $ionicPopup, $timeout, $filter, AlertService, AccountService) {
    var self = this;
    var init = function () {
        if (typeof $rootScope.account === 'undefined')
            self.isLoggedIn = false;
        else {
            self.isLoggedIn = true;
            self.account = $rootScope.account;
            self.account.amount = '';
        }
        $timeout(function () {
            self.showMessage = '';
        }, 2000);
    }

    init();

    self.deposit = function () {
        if (self.isLoggedIn === false)
            AlertService.alertPopup('請登入或開戶');
        else if (!self.account.amount)
            AlertService.alertPopup('請輸入金額');
        else {
            AccountService.operation(self.account, function (data) {
                $rootScope.account.balance = data.account.balance;
                self.showMessage = $rootScope.account.name + ' 已儲值 ' + $filter('currency')(self.account.amount, '', 0) + '元';
                init();
            });
        }
    }

    self.buy = function () {
        if (self.isLoggedIn === false)
            AlertService.alertPopup('請登入或開戶');
        else if (!self.account.amount)
            AlertService.alertPopup('請輸入金額');
        else if (self.account.amount > self.account.balance)
            AlertService.alertPopup('餘額不足');
        else {
            self.account.amount *= -1;
            AccountService.operation(self.account, function (data) {
                $rootScope.account.balance = data.account.balance;
                self.account.amount = Math.abs(self.account.amount);
                self.showMessage = $rootScope.account.name + ' 已消費 ' + $filter('currency')(Math.abs(self.account.amount), '', 0) + '元', 'tab.transactions';
                init();
            });
        }
    }
}]);

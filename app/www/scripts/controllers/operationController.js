angular.module('2017Apps').controller('OperationController', ['$rootScope', '$ionicPopup', '$timeout', '$filter', 'AlertService', 'AccountService', function($rootScope, $ionicPopup, $timeout, $filter, AlertService, AccountService) {
    var self = this;
    var init = function() {
        if (typeof $rootScope.account === 'undefined')
            self.isLoggedIn = false;
        else {
            self.isLoggedIn = true;
            self.account = $rootScope.account;
        }
    }

    init();

    self.deposit = function() {
        if (self.isLoggedIn === false)
            AlertService.alertPopup('請登入或開戶');
        else if (!self.amount)
            AlertService.alertPopup('請輸入金額');
        else {
            self.account.amount = self.amount;
            AccountService.operation(self.account, function(data) {
                $rootScope.account.balance = data.account.balance;
                AlertService.alertPopup($rootScope.account.name + ' 已儲值 ' + $filter('currency')(self.account.amount, '', 0) + '元', 'tab.transactions');
            });
        }
    }

    self.buy = function() {
        if (self.isLoggedIn === false)
            AlertService.alertPopup('請登入或開戶');
        else if (!self.amount)
            AlertService.alertPopup('請輸入金額');
        else if (self.amount > self.account.balance)
            AlertService.alertPopup('餘額不足');
        else {
            self.account.amount = self.amount * -1;
            AccountService.operation(self.account, function(data) {
                $rootScope.account.balance = data.account.balance;
                self.account.amount = Math.abs(self.account.amount);
                AlertService.alertPopup($rootScope.account.name + ' 已消費 ' + $filter('currency')(Math.abs(self.account.amount), '', 0) + '元', 'tab.transactions');
            });
        }
    }
}]);

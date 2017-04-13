angular.module('2017Apps').controller('OperationController', ['$rootScope', '$ionicPopup', '$timeout', '$filter', 'AlertService', function ($rootScope, $ionicPopup, $timeout, $filter, AlertService) {
    var self = this;
    
    var init = function () {
        if (typeof $rootScope.account === 'undefined')
            self.isLoggedIn = false;
        else {
            self.isLoggedIn = true;
            self.operation = {
                amount: '',
                balance: $rootScope.account.balance
            };
        }
        $timeout(function () {
            self.resultMessage = '';
        }, 2000);
    }

    init();

   
   
   
   
   
   
   
    self.deposit = function () {
        if (self.isLoggedIn === false)
            AlertService.alertPopup('請登入或開戶');
        else if (!self.operation.amount)
            AlertService.alertPopup('請輸入金額');
        else {
            $rootScope.account.balance = self.operation.balance += self.operation.amount;
            self.resultMessage = $rootScope.account.name + ' 已儲值 ' + $filter('currency')(self.operation.amount, '', 0) + '元';
            init();
        }
    }

    self.buy = function () {
        if (self.isLoggedIn === false)
            AlertService.alertPopup('請登入或開戶');
        else if (!self.operation.amount)
            AlertService.alertPopup('請輸入金額');
        else if (self.operation.amount > self.operation.balance)
            AlertService.alertPopup('餘額不足');
        else {
            $rootScope.account.balance = self.operation.balance -= self.operation.amount;
            self.resultMessage = $rootScope.account.name + ' 已消費 ' + $filter('currency')(self.operation.amount, '', 0) + '元';
            init();
        }
    }
}]);
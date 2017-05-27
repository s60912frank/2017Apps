angular.module('2017Apps').controller('OperationController', ['$rootScope', '$ionicPopup', '$state', '$filter', 'AlertService', 'AccountService', 'ProductService', function ($rootScope, $ionicPopup, $state, $filter, AlertService, AccountService, ProductService) {
    var self = this;
    var init = function () {
        if (typeof $rootScope.account === 'undefined')
            self.isLoggedIn = false;
        else {
            self.isLoggedIn = true;
            self.account = $rootScope.account;

            ProductService.getProducts(function (data) {
                if (data.error)
                    AlertService.alertPopup('錯誤！', data.error);
                else
                    self.products = data.products;
            });
        }
    }

    init();

    self.deposit = function () {
        if (self.isLoggedIn === false)
            AlertService.alertPopup('錯誤!', '請登入或開戶');
        else if (!self.account.amount)
            AlertService.alertPopup('錯誤!', '請輸入金額');
        else {
            AccountService.deposit({ accountId: self.account._id, amount: self.account.amount }, function (data) {
                $rootScope.account.balance = data.account.balance;                
                AlertService.alertPopup('帳戶作業', $rootScope.account.name + ' 已儲值 ' + $filter('currency')(self.account.amount, '', 0) + '元', 'tab.transactions');
                self.account.amount = '';
            });
        }
    }   

    self.gotoProducts = function () {
        $state.go('tab.products');
    };
}]);

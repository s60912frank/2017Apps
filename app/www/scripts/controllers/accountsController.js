angular.module('2017Apps').controller('AccountsController', ['$rootScope', '$state', 'AccountService', 'AlertService', function ($rootScope, $state, AccountService, AlertService) {
    var self = this;
    self.receivers = [];

    var init = function () {
        if (typeof $rootScope.account === 'undefined')
            self.isLoggedIn = false;
        else {
            self.isLoggedIn = true;
            AccountService.getAccounts(function (data) {
                self.accounts = data.accounts;
            });
        }
    };

    init();

    self.showTransactions = function (account) {
        $state.go('tab.transactions', { account: account });
    };

    self.showMessages = function (account) {
        $state.go('tab.messages', { account: account });
    };

    self.pushMessage = function () {
        if (self.receivers.length === 0)
        AlertService.alertPopup('錯誤！', '未選擇任何帳戶');
        else
            $state.go('tab.sendMessage', { accounts: self.receivers });
    };
}]);
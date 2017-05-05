angular.module('2017Apps').controller('AccountsController', ['$rootScope', '$state', 'AccountService', function ($rootScope, $state, AccountService) {
    var self = this;

    var init = function () {
        if (typeof $rootScope.account === 'undefined')
            self.isLoggedIn = false;
        else {
            self.isLoggedIn = true;
            AccountService.getAccounts(function (data) {
                self.accounts = data.accounts;
            });
        }
    }
    init();

    self.showTransactions = function (account) {
        $state.go('tab.transactions', { account });
    }
}]);
angular.module('2017Apps').controller('AccountsController', ['$rootScope', 'AccountService', function ($rootScope, AccountService) {
    var self = this;

    var init = function () {
        if (typeof $rootScope.account === 'undefined')
            self.isLoggedIn = false;
        else {
            self.isLoggedIn = true;
            AccountService.getAccounts(function (accounts) {
                self.accounts = accounts;
            });
        }
    }
    init();
}]);
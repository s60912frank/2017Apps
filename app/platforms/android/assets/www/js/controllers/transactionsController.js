angular.module('2017Apps').controller('TransactionsController', ['$rootScope', function ($rootScope) {
    var self = this;
    var init = function () {
        if (typeof $rootScope.account === 'undefined')
            self.isLoggedIn = false;
        else {
            self.isLoggedIn = true;
            self.account = $rootScope.account;
        }
    }
    init();
}]);
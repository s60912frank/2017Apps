angular.module('2017Apps').controller('UserController', ['$rootScope', '$state', 'UserService', 'AccountService', 'AlertService', function ($rootScope, $state, UserService, AccountService, AlertService) {
    var self = this;

    var init = function () {
        if (typeof $rootScope.account === 'undefined') {
            self.isLoggedIn = false;
            self.user = {
                username: '',
                password: ''
            };
            self.account = {
                name: '',
                balance: 0
            };
        } else {
            self.isLoggedIn = true;
            self.account = $rootScope.account;
        }
    };

    init();

    self.login = function () {
        if (!self.user.username || !self.user.password) {
            AlertService.alertPopup('請輸入帳號或密碼');
        } else {
            UserService.login(self.user, function (data) {
                if (data.error)
                    AlertService.alertPopup(data.error, null);
                else
                    $rootScope.account = data.account;
                self.account = $rootScope.account;
                init();
            });
        }
    };

    self.openAccount = function () {
        if (!self.user.username || !self.user.password) {
            AlertService.alertPopup('請輸入帳號或密碼');
        } else {
            AccountService.openAccount(self.user, function (data) {
                if (data.error) {
                    AlertService.alertPopup(data.error);
                } else {
                    $rootScope.account = data.account;
                    self.account = $rootScope.account;
                    init();
                }
            })
        }
    };

    self.logout = function () {
        delete $rootScope.account;
        init();
    };

    self.closeAccount = function () {
        AccountService.closeAccount($rootScope.account._id, function (data) {
            if (data.error) {
                AlertService.alertPopup(data.error, null);
            } else {
                delete $rootScope.account;
                init();
            }
        })
    }
}]);

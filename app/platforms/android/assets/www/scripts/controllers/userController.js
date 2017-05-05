angular.module('2017Apps').controller('UserController', ['$window', '$rootScope', '$state', 'UserService', 'AccountService', 'AlertService', function ($window, $rootScope, $state, UserService, AccountService, AlertService) {
    var self = this;

    var init = function () {
        if (typeof $rootScope.account === 'undefined') {
            self.isLoggedIn = false;
            self.user = {
                username: '',
                password: '',
                role: ''
            };
            self.account = {
                name: '',
                balance: 0
            };
        } else {
            self.isLoggedIn = true;
            self.account = $rootScope.account;
            self.mode = (self.account.role === 'manager') ? true : false;
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
                else {
                    $rootScope.account = data.account;
                    $rootScope.role = data.account.role;
                    init();
                }
            });
        }
    };

    self.openAccount = function () {
        self.user.role = 'customer';

        if (!self.user.username || !self.user.password) {
            AlertService.alertPopup('請輸入帳號或密碼');
        } else {
            AccountService.openAccount(self.user, function (data) {
                if (data.error) {
                    AlertService.alertPopup(data.error, null);
                } else {
                    $rootScope.account = data.account;
                    $rootScope.role = data.account.role;
                    init();
                }
            })
        }
    };

    self.logout = function () {
        delete $rootScope.account;
        delete $rootScope.role;
        init();
    };

    self.closeAccount = function () {
        AccountService.closeAccount(self.account._id, function (data) {
            if (data.error) {
                AlertService.alertPopup(data.error);
            } else {
                delete $rootScope.account;
                delete $rootScope.role;
                init();
            }
        })
    }

    self.switchMode = function () {
        AccountService.switchMode({ _id: self.account._id, role: self.mode ? 'manager' : 'customer' }, function (data) {
            $rootScope.account = data.account;
            $rootScope.role = data.account.role;
            init();
        });
    }
}]);

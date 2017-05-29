angular.module('2017Web').controller('UserController', ['$rootScope', '$location', 'UserService', 'AccountService', 'AlertService', ($rootScope, $location, UserService, AccountService, AlertService) => {
    var self = this;
    self.storeId = $rootScope.storeId;

    var init = function() {
        if (typeof $rootScope.user === 'undefined') {
            self.isLoggedIn = false;
            self.user = {
                username: '',
                password: ''
            };
        } else {
            self.isLoggedIn = true;
            self.user = $rootScope.user;
            self.account = $rootScope.account ? $rootScope.account : null;
        }
    };

    init();

    self.login = function() {
        if (!self.user.username || !self.user.password) {
            AlertService.alertPopup('錯誤!', '請輸入帳號或密碼');
        } else {
            UserService.login(self.user, function(data) {
                if (data.error)
                    AlertService.alertPopup('錯誤!', data.error);
                else {
                    $rootScope.user = data.loginUser;
                    init();
                }
            });
        }
    };

    self.register = function() {
        if (!self.user.username || !self.user.password) {
            AlertService.alertPopup('錯誤!', '請輸入帳號或密碼');
        } else {
            UserService.register(self.user, function(data) {
                if (data.error) {
                    AlertService.alertPopup('錯誤!', data.error);
                } else {
                    $rootScope.user = data.loginUser;
                    init();
                }
            })
        }
    };

    self.logout = function() {
        delete $rootScope.user;
        delete $rootScope.account;
        delete $rootScope.role;
        init();
    };

    self.loginAccount = function() {
        var accountId;
        self.user.accounts.filter(function(user) {
            if (user.storeId == $rootScope.storeId)
                accountId = user.accountId;
        });
        AccountService.loginAccount({ accountId, lineId: $location.search().lineId }, function(data) {
            if (data.error)
                AlertService.alertPopup('錯誤!', data.error);
            else {
                $rootScope.account = data.account;
                AlertService.alertPopup('登入成功！', '歡迎使用 LINE@iStore');
                init();
            }
        });
    };

    self.openAccount = function() {
        AccountService.openAccount({ userId: self.user._id, username: self.user.username, lineId: $location.search().lineId }, function(data) {
            if (data.error)
                AlertService.alertPopup('錯誤!', data.error);
            else {
                $rootScope.account = data.account;
                AlertService.alertPopup('註冊成功！', '歡迎使用 LINE@iStore');
                init();
            }
        });
    }
}]);
angular.module('2017Apps').controller('UserController', ['$window', '$rootScope', '$state', 'UserService', 'AccountService', 'AlertService', function($window, $rootScope, $state, UserService, AccountService, AlertService) {
    var self = this;
    self.avaliableStore = ['00', '01', '02', '16']
        /*
        self.loginAccount: 登入過的account
        self.loginUser: SSO登入過的user
        self.user: 帳號密碼deviceToken
        self.loginUser.accounts: 填充過的accounts list
        self.account: 目前list中的account
        */
    var init = function() {
        if (typeof $rootScope.user === 'undefined') {
            self.isLoggedIn = false;
            self.user = {
                username: '',
                password: '',
                deviceToken: ''
            };
        } else {
            self.isLoggedIn = true;
            self.user = $rootScope.user;
            self.loginUser = $rootScope.loginUser
            self.mode = ($rootScope.role === 'manager') ? true : false;
            self.loginAccount = ($rootScope.account) ? $rootScope.account : null;
            self.account = $rootScope.storeId
        }
    };

    init();

    self.login = function() {
        if (!self.user.username || !self.user.password) {
            AlertService.alertPopup('錯誤!', '請輸入帳號或密碼');
        } else {
            FCMPlugin.getToken(function(deviceToken) {
                self.user.deviceToken = deviceToken;
                UserService.login(self.user, function(data) {
                    if (data.error)
                        AlertService.alertPopup('錯誤!', data.error);
                    else {
                        let accountsList = {}
                        for (let i = 0; i < self.avaliableStore.length; i++) {
                            let found = false
                            for (let j = 0; j < data.loginUser.accounts.length; j++) {
                                if (data.loginUser.accounts[j].storeId == self.avaliableStore[i]) {
                                    found = true
                                    accountsList[self.avaliableStore[i]] = data.loginUser.accounts[j]
                                    break
                                }
                            }
                            if (!found) accountsList[self.avaliableStore[i]] = { storeId: self.avaliableStore[i] }
                        }
                        data.loginUser.accounts = accountsList
                        self.loginUser = data.loginUser;
                        $rootScope.loginUser = self.loginUser
                        $rootScope.user = self.user
                        self.account = '16'
                        self.setCurrentStore()
                    }
                });
            });
        }
    };

    self.setCurrentStore = () => {
        let account = self.loginUser.accounts[self.account]
        $rootScope.storeId = account.storeId
        if (account.accountId) {
            $rootScope.account = {}
            AccountService.loginAccount({ accountId: account.accountId }, (data) => {
                if (data.error) {
                    AlertService.alertPopup('錯誤!', data.error);
                } else {
                    FCMPlugin.subscribeToTopic($rootScope.storeTopic());
                    $rootScope.account = data.account;
                    $rootScope.role = data.account.role;
                    init()
                }
            })
        } else {
            delete $rootScope.account
            delete $rootScope.role
            init()
        }
    }

    self.register = function() {
        if (!self.user.username || !self.user.password) {
            AlertService.alertPopup('錯誤!', '請輸入帳號或密碼');
        } else {
            FCMPlugin.getToken(function(deviceToken) {
                self.user.deviceToken = deviceToken;
                UserService.register(self.user, function(data) {
                    if (data.error) {
                        AlertService.alertPopup('錯誤!', data.error);
                    } else {
                        $rootScope.user = data.loginUser;
                        init();
                    }
                })
            });
        }
    };

    self.logout = function() {
        delete $rootScope.user;
        delete $rootScope.account;
        delete $rootScope.role;
        init();
    };

    self.openAccount = function() {
        $rootScope.storeId = self.account
        AccountService.openAccount({ userId: self.loginUser._id, username: self.loginUser.username }, function(data) {
            if (data.error)
                AlertService.alertPopup('錯誤!', data.error);
            else {
                FCMPlugin.subscribeToTopic($rootScope.storeTopic());
                $rootScope.account = data.account;
                $rootScope.role = data.account.role;
                $rootScope.loginUser.accounts[$rootScope.storeId].accountId = data.account._id
                init();
            }
        });
    };

    self.closeAccount = function() {
        AccountService.closeAccount($rootScope.storeId, self.loginAccount._id, function(data) {
            if (data.error) {
                AlertService.alertPopup('錯誤!', data.error);
            } else {
                FCMPlugin.unsubscribeFromTopic($rootScope.storeTopic());
                delete $rootScope.account;
                delete $rootScope.role;
                delete $rootScope.loginUser.accounts[$rootScope.storeId].accountId
                init();
            }
        })
    };

    self.switchMode = function() {
        AccountService.switchMode({ accountId: self.loginAccount._id, role: self.mode ? 'manager' : 'customer' }, function(data) {
            $rootScope.account = data.account;
            $rootScope.role = data.account.role;
            init();
        });
    };
}]);
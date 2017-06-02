angular.module('2017Apps').controller('UserController', ['$window', '$rootScope', '$state', 'UserService', 'AccountService', 'AlertService', function($window, $rootScope, $state, UserService, AccountService, AlertService) {
    var self = this;
    self.avaliableStore = ['00', '01', '02', '16']

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
            self.accounts = ($rootScope.user.accounts && $rootScope.user.accounts.length > 0) ? $rootScope.user.accounts : null;
            //self.account = ($rootScope.account) ? $rootScope.account : null;
            //$rootScope.account = self.account
            self.mode = ($rootScope.role === 'manager') ? true : false;
            self.currentStore = $rootScope.storeId
        }
    };

    init();
    //self.setCurrentStore()

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
                        //填充user(????)
                        $rootScope.user = data.loginUser;
                        for (let i = 0; i < self.avaliableStore.length; i++) {
                            let found = false
                            for (let j = 0; j < $rootScope.user.accounts.length; j++) {
                                if ($rootScope.user.accounts[j].storeId == self.avaliableStore[i]) {
                                    found = true
                                    break
                                }
                            }
                            if (!found) $rootScope.user.accounts.push({ storeId: self.avaliableStore[i] })
                        }
                        AlertService.alertPopup("INFO", JSON.stringify($rootScope.user.accounts))
                        init();
                    }
                });
            });
        }
    };

    self.setCurrentStore = () => {
        let account = JSON.parse(self.account)
        $rootScope.storeId = account.storeId
        AlertService.alertPopup('ISTORE', $rootScope.iStoreUrl())
        if (account.accountId) {
            $rootScope.account = {}
            $rootScope.account.id = account.accountId
            $rootScope.storeId = account.storeId
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

        /*let found = -1
        for (let i = 0; i < self.user.accounts.length; i++) {
            if (self.user.accounts[i].storeId == self.currentStore) {
                found = i
                break
            }
        }
        if (found > -1) {
            let account = self.user.accounts[found]
            $rootScope.account = {}
            $rootScope.account.id = account.accountId
            $rootScope.storeId = account.storeId
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
        }*/
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
        $rootScope.storeId = self.currentStore
            //AlertService.alertPopup('INFO!', $rootScope.iStoreUrl());
        AccountService.openAccount({ userId: self.user._id, username: self.user.username }, function(data) {
            if (data.error)
                AlertService.alertPopup('錯誤!', data.error);
            else {
                FCMPlugin.subscribeToTopic($rootScope.storeTopic());
                $rootScope.account = data.account;
                $rootScope.role = data.account.role;
                init();
            }
        });
    };

    self.closeAccount = function() {
        AccountService.closeAccount($rootScope.storeId, self.account._id, function(data) {
            if (data.error) {
                AlertService.alertPopup('錯誤!', data.error);
            } else {
                FCMPlugin.unsubscribeFromTopic($rootScope.storeTopic());
                delete $rootScope.account;
                delete $rootScope.role;
                init();
            }
        })
    };

    self.switchMode = function() {
        AccountService.switchMode({ accountId: self.account._id, role: self.mode ? 'manager' : 'customer' }, function(data) {
            $rootScope.account = data.account;
            $rootScope.role = data.account.role;
            init();
        });
    };
}]);
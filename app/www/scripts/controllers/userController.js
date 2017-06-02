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
            /*$rootScope.user = user
            $rootScope.account = self.loginAccount*/

            self.isLoggedIn = true;
            self.user = $rootScope.user;
            //self.accounts = ($rootScope.user.accounts && $rootScope.user.accounts.length > 0) ? $rootScope.user.accounts : null;
            self.loginUser = $rootScope.loginUser
                //self.account = ($rootScope.account) ? $rootScope.account : null;
                //$rootScope.account = self.account
            self.mode = ($rootScope.role === 'manager') ? true : false;
            self.loginAccount = ($rootScope.account) ? $rootScope.account : null;
            self.account = $rootScope.selectedAccount
            AlertService.alertPopup('YO', JSON.stringify(self.loginAccount))
                //self.currentStore = $rootScope.storeId
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
                        self.loginUser = data.loginUser;
                        for (let i = 0; i < self.avaliableStore.length; i++) {
                            let found = false
                            for (let j = 0; j < self.loginUser.accounts.length; j++) {
                                if (self.loginUser.accounts[j].storeId == self.avaliableStore[i]) {
                                    found = true
                                    break
                                }
                            }
                            if (!found) self.loginUser.accounts.push({ storeId: self.avaliableStore[i] })
                        }
                        $rootScope.loginUser = self.loginUser
                        $rootScope.user = self.user
                        init();
                    }
                });
            });
        }
    };

    self.setCurrentStore = () => {
        let account = JSON.parse(self.account)
        $rootScope.storeId = account.storeId
        $rootScope.selectedAccount = self.account
            //AlertService.alertPopup('ISTORE', $rootScope.iStoreUrl())
        if (account.accountId) {
            $rootScope.account = {}
                //$rootScope.account.id = account.accountId
                //$rootScope.storeId = account.storeId
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
        let account = JSON.parse(self.account)
        $rootScope.storeId = account.storeId
            //$rootScope.storeId = self.currentStore
            //AlertService.alertPopup('INFO!', $rootScope.iStoreUrl());
        AccountService.openAccount({ userId: self.loginUser._id, username: self.loginUser.username }, function(data) {
            if (data.error)
                AlertService.alertPopup('錯誤!', data.error);
            else {
                FCMPlugin.subscribeToTopic($rootScope.storeTopic());
                $rootScope.account = data.account;
                $rootScope.role = data.account.role;
                $rootScope.loginUser.accounts = $rootScope.loginUser.accounts.filter(ele => {
                    if (ele.storeId == account.storeId) {
                        ele.accountId = data.account._id
                        AlertService.alertPopup('ACCOUNT', JSON.stringify(data.account))
                        $rootScope.selectedAccount = JSON.stringify(ele)
                    }
                    return ele
                })
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
                $rootScope.loginUser.accounts = $rootScope.loginUser.accounts.filter(ele => {
                    if (ele.storeId == $rootScope.storeId) delete ele.accountId
                    return ele
                })
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
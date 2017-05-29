angular.module('2017Apps').controller('UserController', ['$window', '$rootScope', '$state', 'UserService', 'AccountService', 'AlertService', function($window, $rootScope, $state, UserService, AccountService, AlertService) {
    var self = this;
    self.avaliableStore = ['00', '01', '02', '03', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25']

    var init = function() {
        //AlertService.alertPopup("幹!", JSON.stringify($rootScope.user))
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
            self.accounts = ($rootScope.accounts && $rootScope.accounts.length > 0) ? $rootScope.accounts : null;
            self.account = ($rootScope.account) ? $rootScope.account : null;
            self.mode = ($rootScope.role === 'manager') ? true : false;
            self.currentStore = $rootScope.storeId
        }
    };

    init();

    self.login = function() {
        if (!self.user.username || !self.user.password) {
            AlertService.alertPopup('錯誤!', '請輸入帳號或密碼');
        } else {
            FCMPlugin.getToken(function(deviceToken) {
                self.user.deviceToken = deviceToken;
                self.user.deviceToken = 'fZ-mb5ke3hc:APA91bHTuTLk1PjEqllZAD-7Eea41vGdQ-B4PGMODGjRrfyFzSn-yFHGwMvB8kYo69_qmVOvqUSVSk2WoUmWtz7wu1668kwtfEygE3-P46hAWV3qnDcKP4bIHmQmtY5lg-5lz3KqSjGz';
                UserService.login(self.user, function(data) {
                    if (data.error)
                        AlertService.alertPopup('錯誤!', data.error);
                    else {
                        $rootScope.user = data.loginUser;
                        //$rootScope.user = data.loginUser;
                        init();
                    }
                });
            });
        }
    };

    self.setCurrentStore = () => {
        AlertService.alertPopup('幹!', JSON.stringify(self.user.accounts));
        $rootScope.storeId = self.currentStore
        let found = -1
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
            AccountService.loginAccount(account, (data) => {
                if (data.error) {
                    AlertService.alertPopup('錯誤!', data.error);
                } else {
                    //AlertService.alertPopup('好!', '*城之內*');
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
                //self.user.deviceToken = 'fZ-mb5ke3hc:APA91bHTuTLk1PjEqllZAD-7Eea41vGdQ-B4PGMODGjRrfyFzSn-yFHGwMvB8kYo69_qmVOvqUSVSk2WoUmWtz7wu1668kwtfEygE3-P46hAWV3qnDcKP4bIHmQmtY5lg-5lz3KqSjGz';
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
        AlertService.alertPopup('INFO', $rootScope.iStoreUrl());
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
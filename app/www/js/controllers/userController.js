angular.module('2017Apps').controller('UserController', ['$rootScope', '$state', 'AlertService', function ($rootScope, $state, AlertService) {
    self = this;

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
            self.account.name = self.user.username.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
            $rootScope.account = self.account;
        }
        init();
    };

    self.logout = function () {
        delete $rootScope.account;
        init();
    };

    self.openAccount = function () {
        self.login();
    };

    self.closeAccount = function () {
        self.logout();
    }
}]);